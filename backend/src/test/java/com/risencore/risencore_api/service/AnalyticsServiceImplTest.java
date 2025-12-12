package com.risencore.risencore_api.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.risencore.risencore_api.domain.Habit;
import com.risencore.risencore_api.domain.Task;
import com.risencore.risencore_api.domain.Transaction;
import com.risencore.risencore_api.domain.TransactionType;
import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.domain.WeeklyReview;
import com.risencore.risencore_api.repository.HabitRepository;
import com.risencore.risencore_api.repository.TaskRepository;
import com.risencore.risencore_api.repository.TransactionRepository;
import com.risencore.risencore_api.repository.WeeklyReviewRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Collections;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceImplTest {

    @Mock private TaskRepository taskRepository;

    @Mock private TransactionRepository transactionRepository;

    @Mock private HabitRepository habitRepository;

    @Mock private WeeklyReviewRepository weeklyReviewRepository;

    @Mock private UserService userService;

    @Mock private AIService aiService;

    @InjectMocks private AnalyticsServiceImpl analyticsService;

    private User user;
    private LocalDateTime fixedNow;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setFirstName("Test");
        fixedNow = LocalDateTime.of(2024, 9, 15, 20, 0); // Sunday 20:00 UTC

        when(userService.getCurrentUser()).thenReturn(user);
    }

    @Test
    @DisplayName("generateWeeklyReview should return cached review when present")
    void generateWeeklyReview_usesCachedValue() {
        LocalDateTime weekStart = LocalDateTime.of(2024, 9, 15, 19, 0);
        WeeklyReview existing = new WeeklyReview();
        existing.setReviewText("cached");
        existing.setWeekStartDate(weekStart);

        when(weeklyReviewRepository.findByUserAndWeekStartDate(user, weekStart))
                .thenReturn(Optional.of(existing));

        try (MockedStatic<LocalDateTime> mocked = org.mockito.Mockito.mockStatic(LocalDateTime.class)) {
            mocked.when(() -> LocalDateTime.now(ZoneOffset.UTC)).thenReturn(fixedNow);

            String result = analyticsService.generateWeeklyReview();

            assertThat(result).isEqualTo("cached");
            verify(aiService, never()).generateTextFromPrompt(any(String.class));
        }
    }

    @Test
    @DisplayName("generateWeeklyReview should build prompt, call AI service and persist review")
    void generateWeeklyReview_generatesAndSaves() {
        Task task = new Task();
        task.setDescription("Task");

        Transaction transaction = new Transaction();
        transaction.setAmount(new BigDecimal("5.00"));
        transaction.setType(TransactionType.EXPENSE);
        transaction.setTransactionDate(LocalDate.now());

        Habit habit = new Habit();
        habit.setUser(user);

        when(taskRepository.findByUserAndCreatedAtAfter(any(User.class), any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(task));
        when(transactionRepository.findByUserAndTransactionDateAfter(any(User.class), any(LocalDate.class)))
                .thenReturn(Collections.singletonList(transaction));
        when(habitRepository.findByUser(user)).thenReturn(Collections.singletonList(habit));
        when(weeklyReviewRepository.findByUserAndWeekStartDate(any(User.class), any(LocalDateTime.class)))
                .thenReturn(Optional.empty());
        when(aiService.generateTextFromPrompt(any(String.class))).thenReturn("generated");

        try (MockedStatic<LocalDateTime> mocked = org.mockito.Mockito.mockStatic(LocalDateTime.class)) {
            mocked.when(() -> LocalDateTime.now(ZoneOffset.UTC)).thenReturn(fixedNow);

            String result = analyticsService.generateWeeklyReview();

            assertThat(result).isEqualTo("generated");
            verify(weeklyReviewRepository).save(any(WeeklyReview.class));
            verify(aiService).generateTextFromPrompt(any(String.class));
        }
    }
}
