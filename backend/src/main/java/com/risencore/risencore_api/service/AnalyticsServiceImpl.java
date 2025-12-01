package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.*;
import com.risencore.risencore_api.repository.HabitRepository;
import com.risencore.risencore_api.repository.TaskRepository;
import com.risencore.risencore_api.repository.TransactionRepository;
import com.risencore.risencore_api.repository.WeeklyReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TaskRepository taskRepository;
    private final TransactionRepository transactionRepository;
    private final HabitRepository habitRepository;
    private final WeeklyReviewRepository weeklyReviewRepository;
    private final UserService userService;
    private final AIService aiService;

    @Override
    @Transactional
    public String generateWeeklyReview() {
        User currentUser = userService.getCurrentUser();
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

        // 1. Determine the "current review window"
        // Logic: A review is available for the week ending on the most recent Sunday at
        // 19:00.
        // If today is Sunday and it's before 19:00, we show the PREVIOUS week's review
        // (or wait).
        // If today is Sunday and it's after 19:00, we show THIS week's review.

        LocalDateTime currentReviewWeekStart = calculateReviewWeekStart(now);

        // 2. Check if we already have a generated review for this window
        Optional<WeeklyReview> existingReview = weeklyReviewRepository.findByUserAndWeekStartDate(currentUser,
                currentReviewWeekStart);

        if (existingReview.isPresent()) {
            return existingReview.get().getReviewText();
        }

        // 3. If not, generate a new one
        // Gather data from the week defined by currentReviewWeekStart
        LocalDateTime weekStart = currentReviewWeekStart;
        LocalDateTime weekEnd = weekStart.plusDays(7);

        List<Task> recentTasks = taskRepository.findByUserAndCreatedAtAfter(currentUser, weekStart);
        // Note: You might want to filter tasks strictly between weekStart and weekEnd
        // if you want precise weekly buckets.
        // For now, "after weekStart" is close enough to "last 7 days" logic if run on
        // Sunday.

        List<Transaction> recentTransactions = transactionRepository.findByUserAndTransactionDateAfter(currentUser,
                weekStart.toLocalDate());
        List<Habit> allHabits = habitRepository.findByUser(currentUser);

        String prompt = buildWeeklyReviewPrompt(currentUser, recentTasks, recentTransactions, allHabits,
                weekStart.toLocalDate(), weekEnd.toLocalDate());
        String generatedText = aiService.generateTextFromPrompt(prompt);

        // 4. Save the new review
        WeeklyReview newReview = new WeeklyReview();
        newReview.setUser(currentUser);
        newReview.setReviewText(generatedText);
        newReview.setGeneratedAt(now);
        newReview.setWeekStartDate(currentReviewWeekStart);
        weeklyReviewRepository.save(newReview);

        return generatedText;
    }

    private LocalDateTime calculateReviewWeekStart(LocalDateTime now) {
        // We want the review to be available every Sunday at 19:00.
        // So if now is Sunday 20:00, the review period is the previous Mon-Sun.
        // Let's define "Week Start" as the Monday BEFORE the review release.

        // Find the most recent Sunday (or today if it is Sunday)
        LocalDateTime lastSunday = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));

        // If today is Sunday but BEFORE 19:00, we fall back to the PREVIOUS Sunday.
        if (now.getDayOfWeek() == DayOfWeek.SUNDAY && now.getHour() < 19) {
            lastSunday = lastSunday.minusWeeks(1);
        } else if (now.getDayOfWeek() != DayOfWeek.SUNDAY && now.isBefore(lastSunday.withHour(19))) {
            // This case handles if we are e.g. Monday but using previousOrSame(Sunday)
            // might jump forward if we aren't careful,
            // but previousOrSame(Sunday) on Monday returns the PREVIOUS Sunday, so we are
            // good.
            // Actually, let's simplify.
        }

        // Simplified Logic:
        // 1. Get the potential "release time" for this week: This coming Sunday 19:00?
        // No, that's future.
        // We want the MOST RECENT past "Sunday 19:00".

        LocalDateTime candidate = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY)).withHour(19)
                .withMinute(0).withSecond(0).withNano(0);

        if (now.isBefore(candidate)) {
            // We are on Sunday before 19:00, so go back a week
            candidate = candidate.minusWeeks(1);
        }

        // The "Week Start" that this review covers is 7 days before that Sunday 19:00
        // (roughly).
        // Or we can just use the candidate timestamp as the unique key for the week.
        // Let's use the candidate timestamp (Sunday 19:00) as the "Week Start" key for
        // simplicity in the DB,
        // effectively meaning "The review released on [Date]".

        return candidate;
    }

    private String buildWeeklyReviewPrompt(User user, List<Task> tasks, List<Transaction> transactions,
            List<Habit> habits, LocalDate start, LocalDate end) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are RisenCore, a friendly, insightful, and motivating digital life assistant. ");
        sb.append("Your persona is supportive and slightly informal, like a personal coach. ");
        sb.append(
                "DO NOT start your response with conversational filler like 'Of course!', 'Certainly!', or 'Here is your review'. ");
        sb.append(
                "You must begin your response DIRECTLY with the greeting to the user. For example: 'Hey [User's Name], let's see how your week went!'\n\n");

        sb.append("Your task is to analyze the following JSON data for the user '").append(user.getFirstName())
                .append("' ");
        sb.append("for the period ").append(start).append(" to ").append(end).append(". ");
        sb.append("Generate a short, encouraging weekly review consisting of 3 to 4 bullet points. ");
        sb.append("Focus on finding at least one interesting pattern or a significant achievement. ");
        sb.append("Use Markdown for formatting (e.g., use '*' for bullet points and '**' for bold text).\n\n");

        sb.append("Here is the user's data:\n");
        sb.append("```json\n");

        // Tasks Data
        String tasksJson = tasks.stream()
                .map(t -> String.format("{\"description\": \"%s\", \"completed\": %b}",
                        t.getDescription().replace("\"", "'"), t.isCompleted()))
                .collect(Collectors.joining(", ", "[", "]"));
        sb.append("{\"tasks\": ").append(tasksJson).append(",\n");

        // Transactions Data
        String transactionsJson = transactions.stream()
                .map(t -> String.format("{\"type\": \"%s\", \"category\": \"%s\", \"amount\": %.2f}", t.getType(),
                        t.getCategory(), t.getAmount()))
                .collect(Collectors.joining(", ", "[", "]"));
        sb.append("\"transactions\": ").append(transactionsJson).append(",\n");

        // Habits Data
        String habitsJson = habits.stream()
                .map(h -> {
                    long completionsLastWeek = h.getCompletions().stream()
                            .filter(c -> c.getCompletionDate().isAfter(start))
                            .count();
                    return String.format("{\"name\": \"%s\", \"completions_last_week\": %d}",
                            h.getName().replace("\"", "'"), completionsLastWeek);
                })
                .collect(Collectors.joining(", ", "[", "]"));
        sb.append("\"habits\": ").append(habitsJson).append("}\n");

        sb.append("```\n\n");

        sb.append("Now, generate the review, starting directly with the greeting.");

        return sb.toString();
    }
}