package com.risencore.risencore_api.service;

import com.risencore.risencore_api.domain.Habit;
import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.domain.Transaction;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.repository.HabitRepository;
import com.risencore.risencore_api.repository.TaskRepository;
import com.risencore.risencore_api.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TaskRepository taskRepository;
    private final TransactionRepository transactionRepository;
    private final HabitRepository habitRepository;
    private final UserService userService; // To get the current user
    private final AIService aiService;     // Our AI abstraction

    @Override
    @Transactional(readOnly = true)
    public String generateWeeklyReview() {
        User currentUser = userService.getCurrentUser();

        LocalDateTime oneWeekAgoLocalDateTime = LocalDateTime.now(ZoneOffset.UTC).minusDays(7);
        LocalDate oneWeekAgoDate = LocalDate.now(ZoneOffset.UTC).minusDays(7);

        List<Task> recentTasks = taskRepository.findByUserAndCreatedAtAfter(currentUser, oneWeekAgoLocalDateTime);
        List<Transaction> recentTransactions = transactionRepository.findByUserAndTransactionDateAfter(currentUser, oneWeekAgoDate);
        List<Habit> allHabits = habitRepository.findByUser(currentUser);

        // 2. Build the prompt for the AI
        String prompt = buildWeeklyReviewPrompt(currentUser, recentTasks, recentTransactions, allHabits);

        // 3. Call the AI service and return the result
        return aiService.generateTextFromPrompt(prompt);
    }

    private String buildWeeklyReviewPrompt(User user, List<Task> tasks, List<Transaction> transactions, List<Habit> habits) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are RisenCore, a friendly, insightful, and motivating digital life assistant. ");
        sb.append("Your persona is supportive and slightly informal, like a personal coach. ");
        sb.append("DO NOT start your response with conversational filler like 'Of course!', 'Certainly!', or 'Here is your review'. ");
        sb.append("You must begin your response DIRECTLY with the greeting to the user. For example: 'Hey [User's Name], let's see how your week went!'\n\n");

        sb.append("Your task is to analyze the following JSON data for the user '").append(user.getFirstName()).append("' from the last 7 days. ");
        sb.append("Generate a short, encouraging weekly review consisting of 3 to 4 bullet points. ");
        sb.append("Focus on finding at least one interesting pattern or a significant achievement. ");
        sb.append("Use Markdown for formatting (e.g., use '*' for bullet points and '**' for bold text).\n\n");

        sb.append("Here is the user's data:\n");
        sb.append("```json\n");

        // Tasks Data
        String tasksJson = tasks.stream()
                .map(t -> String.format("{\"description\": \"%s\", \"completed\": %b}", t.getDescription().replace("\"", "'"), t.isCompleted()))
                .collect(Collectors.joining(", ", "[", "]"));
        sb.append("{\"tasks\": ").append(tasksJson).append(",\n");

        // Transactions Data
        String transactionsJson = transactions.stream()
                .map(t -> String.format("{\"type\": \"%s\", \"category\": \"%s\", \"amount\": %.2f}", t.getType(), t.getCategory(), t.getAmount()))
                .collect(Collectors.joining(", ", "[", "]"));
        sb.append("\"transactions\": ").append(transactionsJson).append(",\n");

        // Habits Data
        String habitsJson = habits.stream()
                .map(h -> {
                    long completionsLastWeek = h.getCompletions().stream()
                            .filter(c -> c.getCompletionDate().isAfter(LocalDate.now(ZoneOffset.UTC).minusDays(7)))
                            .count();
                    return String.format("{\"name\": \"%s\", \"completions_last_week\": %d}", h.getName().replace("\"", "'"), completionsLastWeek);
                })
                .collect(Collectors.joining(", ", "[", "]"));
        sb.append("\"habits\": ").append(habitsJson).append("}\n");

        sb.append("```\n\n");

        sb.append("Now, generate the review, starting directly with the greeting.");

        return sb.toString();
    }
}