package com.risencore.risencore_api.repository;

import com.risencore.risencore_api.domain.User;
import com.risencore.risencore_api.domain.WeeklyReview;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeeklyReviewRepository extends JpaRepository<WeeklyReview, Long> {
    Optional<WeeklyReview> findByUserAndWeekStartDate(User user, LocalDateTime weekStartDate);
}
