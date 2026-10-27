package com.university.lostfound.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final Path privateProofStorageLocation;

    public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir,
                              @Value("${app.private-proof.dir:private-proof-uploads}") String privateProofDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.privateProofStorageLocation = Paths.get(privateProofDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            Files.createDirectories(this.privateProofStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create directory for uploaded files.", ex);
        }
    }

    /** Stores ownership evidence outside the publicly served /uploads directory. */
    public String storePrivateProof(MultipartFile file) {
        validateFile(file, "image/jpeg", "image/png", "application/pdf");
        String contentType = file.getContentType();
        String extension = "application/pdf".equalsIgnoreCase(contentType) ? ".pdf"
                : ("image/png".equalsIgnoreCase(contentType) ? ".png" : ".jpg");
        String fileName = UUID.randomUUID() + extension;
        Path target = privateProofStorageLocation.resolve(fileName).normalize();
        if (!target.startsWith(privateProofStorageLocation)) {
            throw new RuntimeException("Invalid proof document path.");
        }
        try (InputStream inputStream = file.getInputStream();
             java.io.OutputStream outputStream = Files.newOutputStream(
                     target, StandardOpenOption.CREATE_NEW, StandardOpenOption.WRITE)) {
            inputStream.transferTo(outputStream);
            return "private:" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store private proof document.", ex);
        }
    }

    public Resource loadPrivateProof(String storageReference) {
        if (storageReference == null || !storageReference.startsWith("private:")) {
            throw new IllegalArgumentException("This proof document is not stored in private storage.");
        }
        String fileName = storageReference.substring("private:".length());
        Path target = privateProofStorageLocation.resolve(fileName).normalize();
        if (!target.startsWith(privateProofStorageLocation) || !Files.isRegularFile(target)) {
            throw new IllegalArgumentException("Proof document not found.");
        }
        return new FileSystemResource(target);
    }

    public String storeFile(MultipartFile file) {
        validateFile(file, "image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf");

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i >= 0) {
            extension = originalFilename.substring(i);
        }
        String fileName = UUID.randomUUID().toString() + extension;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return "/uploads/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public void validateFile(MultipartFile file, String... allowedContentTypes) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select a valid file to upload.");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds the 10MB limit.");
        }

        String contentType = file.getContentType();
        boolean allowed = contentType != null && java.util.Arrays.stream(allowedContentTypes)
                .anyMatch(contentType::equalsIgnoreCase);
        if (!allowed) {
            throw new RuntimeException("Unsupported file type. Please upload only images or PDFs.");
        }

        // Do not trust the multipart Content-Type alone; verify the file's actual signature.
        try (InputStream inputStream = file.getInputStream()) {
            String detectedType = detectContentType(inputStream.readNBytes(12));
            boolean detectedTypeAllowed = detectedType != null
                    && java.util.Arrays.stream(allowedContentTypes)
                    .anyMatch(type -> type.equalsIgnoreCase(detectedType));
            if (!detectedTypeAllowed || !detectedType.equalsIgnoreCase(contentType)) {
                throw new RuntimeException("File content does not match its declared file type.");
            }
        } catch (IOException ex) {
            throw new RuntimeException("Could not validate uploaded file content.", ex);
        }
    }

    private String detectContentType(byte[] header) {
        if (header.length >= 5
                && header[0] == '%' && header[1] == 'P' && header[2] == 'D'
                && header[3] == 'F' && header[4] == '-') {
            return "application/pdf";
        }
        if (header.length >= 3
                && (header[0] & 0xFF) == 0xFF
                && (header[1] & 0xFF) == 0xD8
                && (header[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (header.length >= 8
                && (header[0] & 0xFF) == 0x89
                && header[1] == 'P' && header[2] == 'N' && header[3] == 'G'
                && (header[4] & 0xFF) == 0x0D
                && (header[5] & 0xFF) == 0x0A
                && (header[6] & 0xFF) == 0x1A
                && (header[7] & 0xFF) == 0x0A) {
            return "image/png";
        }
        if (header.length >= 12
                && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
                && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P') {
            return "image/webp";
        }
        if (header.length >= 6
                && header[0] == 'G' && header[1] == 'I' && header[2] == 'F'
                && header[3] == '8' && (header[4] == '7' || header[4] == '9') && header[5] == 'a') {
            return "image/gif";
        }
        return null;
    }
}
