package com.university.lostfound.service;

import com.university.lostfound.dto.AuditLogDTO;
import com.university.lostfound.entity.AuditLog;
import com.university.lostfound.entity.User;
import com.university.lostfound.mapper.DTOMapper;
import com.university.lostfound.repository.AuditLogRepository;
import com.university.lostfound.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final DTOMapper dtoMapper;

    public AuditLogService(AuditLogRepository auditLogRepository,
                           UserRepository userRepository,
                           DTOMapper dtoMapper) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
        this.dtoMapper = dtoMapper;
    }

    @Transactional
    public void logAction(String userEmail, String action, String entityName, Long entityId, String description, String method, String url, String ip) {
        User user = null;
        if (userEmail != null) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }

        AuditLog log = new AuditLog();
        log.setUser(user);
        log.setAction(action);
        log.setEntityName(entityName);
        log.setEntityId(entityId);
        log.setDescription(description);
        log.setRequestMethod(method);
        log.setRequestUrl(url);
        log.setIpAddress(ip);
        log.setActionStatus("SUCCESS");

        auditLogRepository.save(log);
    }

    public List<AuditLogDTO> getRecentAuditLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc().stream()
                .map(dtoMapper::toAuditLogDTO)
                .collect(Collectors.toList());
    }
}
