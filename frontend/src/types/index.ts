export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  universityId: string;
  profileImage?: string;
  isActive: boolean;
  roleId: number;
  roleName: string;
  departmentId?: number;
  departmentName?: string;
  createdAt: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
  isActive: boolean;
}

export interface Location {
  locationId: number;
  locationName: string;
  description?: string;
  building?: string;
  floorNo?: string;
  isActive: boolean;
}

export interface ItemType {
  typeId: number;
  typeName: 'LOST' | 'FOUND';
  description?: string;
}

export interface ItemStatus {
  statusId: number;
  statusName: 'OPEN' | 'UNDER_REVIEW' | 'CLAIM_REQUESTED' | 'CLAIM_APPROVED' | 'CLAIM_REJECTED' | 'COLLECTED' | 'CLOSED';
  description?: string;
  displayOrder?: number;
}

export interface ItemImage {
  imageId: number;
  imageUrl: string;
  imageName?: string;
  isPrimary: boolean;
}

export interface Item {
  itemId: number;
  title: string;
  description?: string;
  category: Category;
  location: Location;
  type: ItemType;
  status: ItemStatus;
  uploadedBy: User;
  claimedBy?: User;
  verifiedBy?: User;
  brand?: string;
  color?: string;
  serialNumber?: string;
  itemCondition?: string;
  dateLost?: string;
  dateFound?: string;
  isVerified: boolean;
  isClaimable: boolean;
  isActive: boolean;
  remarks?: string;
  images: ItemImage[];
  createdAt: string;
  updatedAt?: string;
}

export interface Claim {
  claimId: number;
  item: Item;
  claimant: User;
  reviewedBy?: User;
  proofDescription: string;
  proofDocumentUrl?: string;
  claimStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COLLECTED';
  reviewerRemarks?: string;
  claimedAt: string;
  reviewedAt?: string;
}

export interface Notification {
  notificationId: number;
  notificationType: string;
  senderName?: string;
  receiverId: number;
  itemId?: number;
  claimId?: number;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Announcement {
  announcementId: number;
  title: string;
  message: string;
  postedBy: User;
  targetRoleName?: string;
  startDate: string;
  endDate?: string;
  isPinned: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AuditLog {
  auditLogId: number;
  userName?: string;
  userEmail?: string;
  action: string;
  entityName: string;
  entityId?: number;
  description?: string;
  requestMethod?: string;
  requestUrl?: string;
  ipAddress?: string;
  actionStatus: string;
  failureReason?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  departmentName?: string;
  profileImage?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalItems: number;
  totalLostItems: number;
  totalFoundItems: number;
  pendingClaims: number;
  approvedClaims: number;
  totalAnnouncements: number;
  categoryAnalytics: Record<string, number>;
  locationAnalytics: Record<string, number>;
  recentItems: Item[];
  recentClaims: Claim[];
  recentAuditLogs: AuditLog[];
}

export interface StudentDashboardData {
  myReportedItemsCount: number;
  myClaimsCount: number;
  pendingClaimsCount: number;
  approvedClaimsCount: number;
  recentFoundItems: Item[];
  myActiveClaims: Claim[];
  announcements: Announcement[];
}
