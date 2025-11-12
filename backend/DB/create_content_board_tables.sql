-- =============================================
-- AGROUNDS Content Board Tables
-- 이벤트, 공지사항, 문의사항 통합 관리 테이블
-- =============================================

-- content_board 테이블 생성
CREATE TABLE IF NOT EXISTS `content_board` (
  `content_code` VARCHAR(45) NOT NULL COMMENT '컨텐츠 고유 코드',
  `category` VARCHAR(45) NOT NULL COMMENT '카테고리 (event/notice/inquiry)',
  `author_code` VARCHAR(45) NOT NULL COMMENT '작성자 user_code',
  
  -- 제목 및 내용
  `title` VARCHAR(200) NOT NULL COMMENT '제목',
  `content` TEXT NOT NULL COMMENT '본문 내용',
  
  -- 이미지 및 첨부파일
  `thumbnail_url` VARCHAR(500) DEFAULT NULL COMMENT '썸네일 이미지 S3 URL',
  `image_urls` JSON DEFAULT NULL COMMENT '추가 이미지 URL 리스트',
  `attachment_urls` JSON DEFAULT NULL COMMENT '첨부파일 URL 리스트',
  
  -- 조회수 및 통계
  `view_count` INT DEFAULT 0 COMMENT '조회수',
  `like_count` INT DEFAULT 0 COMMENT '좋아요 수',
  
  -- 이벤트 전용 필드
  `event_start_date` DATETIME DEFAULT NULL COMMENT '이벤트 시작일',
  `event_end_date` DATETIME DEFAULT NULL COMMENT '이벤트 종료일',
  `event_link` VARCHAR(500) DEFAULT NULL COMMENT '이벤트 참여 링크',
  `event_reward` VARCHAR(200) DEFAULT NULL COMMENT '이벤트 보상 설명',
  `event_conditions` JSON DEFAULT NULL COMMENT '이벤트 참여 조건',
  
  -- 공지사항 전용 필드
  `priority` VARCHAR(45) DEFAULT NULL COMMENT '중요도 (low/normal/high/urgent)',
  `is_pinned` TINYINT(1) DEFAULT 0 COMMENT '상단 고정 여부',
  `notice_start_date` DATETIME DEFAULT NULL COMMENT '공지 시작일',
  `notice_end_date` DATETIME DEFAULT NULL COMMENT '공지 종료일',
  
  -- 문의사항 전용 필드
  `inquiry_type` VARCHAR(45) DEFAULT NULL COMMENT '문의 유형 (account/payment/match_analysis/team/ground/app_feature/bug_report/suggestion/other)',
  `status` VARCHAR(45) DEFAULT NULL COMMENT '처리 상태 (pending/in_progress/completed/rejected)',
  
  -- 관련 엔티티 참조
  `related_match_code` VARCHAR(45) DEFAULT NULL COMMENT '관련 경기 코드',
  `related_quarter_code` VARCHAR(45) DEFAULT NULL COMMENT '관련 쿼터 코드',
  `related_team_code` VARCHAR(45) DEFAULT NULL COMMENT '관련 팀 코드',
  `related_ground_code` VARCHAR(45) DEFAULT NULL COMMENT '관련 그라운드 코드',
  
  -- 답변 정보
  `answer` TEXT DEFAULT NULL COMMENT '답변 내용',
  `answered_by` VARCHAR(45) DEFAULT NULL COMMENT '답변자 user_code',
  `answered_at` DATETIME DEFAULT NULL COMMENT '답변 작성일',
  
  -- 비공개 여부
  `is_private` TINYINT(1) DEFAULT 1 COMMENT '비공개 여부 (문의사항 기본 비공개)',
  
  -- 대상 사용자 설정
  `target_user_type` VARCHAR(45) DEFAULT 'all' COMMENT '대상 사용자 타입 (all/player/coach/parents/youth/adult/pro)',
  
  -- 공개 설정
  `is_published` TINYINT(1) DEFAULT 1 COMMENT '게시 여부',
  `published_at` DATETIME DEFAULT NULL COMMENT '예약 발행일',
  
  -- 메타 데이터
  `metadata` JSON DEFAULT NULL COMMENT '추가 메타데이터',
  `tags` JSON DEFAULT NULL COMMENT '태그 리스트',
  
  -- 타임스탬프
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '삭제일 (소프트 삭제)',
  
  PRIMARY KEY (`content_code`),
  INDEX `idx_category` (`category`),
  INDEX `idx_author_code` (`author_code`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`),
  INDEX `idx_deleted_at` (`deleted_at`),
  INDEX `idx_is_published` (`is_published`),
  INDEX `idx_is_pinned` (`is_pinned`),
  INDEX `idx_target_user_type` (`target_user_type`),
  INDEX `idx_category_deleted` (`category`, `deleted_at`),
  INDEX `idx_category_published` (`category`, `is_published`, `deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='컨텐츠 게시판 통합 테이블';

-- content_event_participation 테이블 생성
CREATE TABLE IF NOT EXISTS `content_event_participation` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '참여 ID',
  `content_code` VARCHAR(45) NOT NULL COMMENT '컨텐츠 코드 (이벤트)',
  `user_code` VARCHAR(45) NOT NULL COMMENT '참여자 user_code',
  
  -- 참여 정보
  `is_completed` TINYINT(1) DEFAULT 0 COMMENT '이벤트 완료 여부',
  `reward_received` TINYINT(1) DEFAULT 0 COMMENT '보상 수령 여부',
  
  -- 참여 데이터
  `participation_data` JSON DEFAULT NULL COMMENT '이벤트별 참여 데이터',
  
  -- 타임스탬프
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '참여일',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '삭제일 (소프트 삭제)',
  
  PRIMARY KEY (`id`),
  INDEX `idx_content_code` (`content_code`),
  INDEX `idx_user_code` (`user_code`),
  INDEX `idx_deleted_at` (`deleted_at`),
  INDEX `idx_is_completed` (`is_completed`),
  INDEX `idx_reward_received` (`reward_received`),
  UNIQUE KEY `unique_participation` (`content_code`, `user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='이벤트 참여 추적 테이블';

-- content_comment 테이블 생성
CREATE TABLE IF NOT EXISTS `content_comment` (
  `comment_code` VARCHAR(45) NOT NULL COMMENT '댓글 고유 코드',
  `content_code` VARCHAR(45) NOT NULL COMMENT '컨텐츠 코드',
  `user_code` VARCHAR(45) NOT NULL COMMENT '작성자 user_code',
  
  -- 댓글 내용
  `comment` TEXT NOT NULL COMMENT '댓글 내용',
  
  -- 대댓글 지원
  `parent_comment_code` VARCHAR(45) DEFAULT NULL COMMENT '부모 댓글 코드 (대댓글인 경우)',
  
  -- 좋아요
  `like_count` INT DEFAULT 0 COMMENT '좋아요 수',
  
  -- 타임스탬프
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '삭제일 (소프트 삭제)',
  
  PRIMARY KEY (`comment_code`),
  INDEX `idx_content_code` (`content_code`),
  INDEX `idx_user_code` (`user_code`),
  INDEX `idx_parent_comment_code` (`parent_comment_code`),
  INDEX `idx_deleted_at` (`deleted_at`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='컨텐츠 댓글 테이블';

-- =============================================
-- 실행 완료 메시지
-- =============================================
SELECT 'Content Board Tables Created Successfully!' AS Result;

