package com.university.lostfound.service;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.university.lostfound.dto.ClaimDTO;
import com.university.lostfound.entity.Claim;
import com.university.lostfound.entity.ClaimStatus;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.ClaimRepository;
import com.university.lostfound.repository.ItemRepository;
import com.university.lostfound.repository.ItemStatusRepository;
import com.university.lostfound.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ClaimServiceQueueTest {

    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ItemStatusRepository itemStatusRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private DTOMapper dtoMapper;

    @InjectMocks
    private ClaimService claimService;

    @Test
    void getAllClaims_shouldExcludeResolvedClaimsFromActiveQueue() {
        Claim pending = new Claim();
        pending.setClaimId(1L);
        pending.setClaimStatus(ClaimStatus.PENDING);

        Claim underReview = new Claim();
        underReview.setClaimId(2L);
        underReview.setClaimStatus(ClaimStatus.UNDER_REVIEW);

        Claim approved = new Claim();
        approved.setClaimId(3L);
        approved.setClaimStatus(ClaimStatus.APPROVED);

        Claim rejected = new Claim();
        rejected.setClaimId(4L);
        rejected.setClaimStatus(ClaimStatus.REJECTED);

        Claim collected = new Claim();
        collected.setClaimId(5L);
        collected.setClaimStatus(ClaimStatus.COLLECTED);

        when(claimRepository.findAllByOrderByClaimedAtDesc())
                .thenReturn(List.of(pending, underReview, approved, rejected, collected));

        when(dtoMapper.toClaimDTO(pending)).thenReturn(new ClaimDTO());
        when(dtoMapper.toClaimDTO(underReview)).thenReturn(new ClaimDTO());

        List<ClaimDTO> claims = claimService.getAllClaims();

        assertEquals(2, claims.size());
    }
}
