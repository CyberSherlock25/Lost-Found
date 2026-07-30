package com.university.lostfound.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "claim_id")
    private Long claimId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "claimant_user_id", nullable = false)
    private User claimant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewed_by_user_id")
    private User reviewedBy;

    @Column(name = "proof_description", nullable = false, columnDefinition = "TEXT")
    private String proofDescription;

    @Column(name = "proof_document_url", length = 500)
    private String proofDocumentUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "claim_status", length = 30)
    private ClaimStatus claimStatus = ClaimStatus.PENDING;

    @Column(name = "reviewer_remarks", columnDefinition = "TEXT")
    private String reviewerRemarks;

    @Column(name = "claimed_at", updatable = false)
    private LocalDateTime claimedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    public Claim() {}

    @PrePersist
    protected void onCreate() {
        this.claimedAt = LocalDateTime.now();
        if (this.claimStatus == null) this.claimStatus = ClaimStatus.PENDING;
    }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public User getClaimant() { return claimant; }
    public void setClaimant(User claimant) { this.claimant = claimant; }

    public User getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(User reviewedBy) { this.reviewedBy = reviewedBy; }

    public String getProofDescription() { return proofDescription; }
    public void setProofDescription(String proofDescription) { this.proofDescription = proofDescription; }

    public String getProofDocumentUrl() { return proofDocumentUrl; }
    public void setProofDocumentUrl(String proofDocumentUrl) { this.proofDocumentUrl = proofDocumentUrl; }

    public ClaimStatus getClaimStatus() { return claimStatus; }
    public void setClaimStatus(ClaimStatus claimStatus) { this.claimStatus = claimStatus; }

    public String getReviewerRemarks() { return reviewerRemarks; }
    public void setReviewerRemarks(String reviewerRemarks) { this.reviewerRemarks = reviewerRemarks; }

    public LocalDateTime getClaimedAt() { return claimedAt; }
    public void setClaimedAt(LocalDateTime claimedAt) { this.claimedAt = claimedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Claim claim = (Claim) o;
        return Objects.equals(claimId, claim.claimId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(claimId);
    }

    @Override
    public String toString() {
        return "Claim{" +
                "claimId=" + claimId +
                ", claimStatus=" + claimStatus +
                ", claimedAt=" + claimedAt +
                '}';
    }
}
