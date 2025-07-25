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
        sb.append("You are RisenCore, a friendly and motivating digital life assistant. ");
        sb.append("Analyze the following data for the user '").append(user.getFirstName()).append("' for the last 7 days and provide a short, insightful, and encouraging weekly review in 3-4 bullet points. ");
        sb.append("Focus on interesting patterns or achievements. Be positive and speak directly to the user.\n\n");
        sb.append("Here is the data in JSON format:\n");

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

        // Habits Data (including completion status for the last week)
        String habitsJson = habits.stream()
                .map(h -> {
                    long completionsLastWeek = h.getCompletions().stream()
                            .filter(c -> c.getCompletionDate().isAfter(LocalDate.now(ZoneOffset.UTC).minusDays(7)))
                            .count();
                    return String.format("{\"name\": \"%s\", \"completions_last_week\": %d}", h.getName().replace("\"", "'"), completionsLastWeek);
                })
                .collect(Collectors.joining(", ", "[", "]"));
        sb.append("\"habits\": ").append(habitsJson).append("}\n");

        sb.append("\nNow, provide the weekly review.");
        return sb.toString();
    }
}