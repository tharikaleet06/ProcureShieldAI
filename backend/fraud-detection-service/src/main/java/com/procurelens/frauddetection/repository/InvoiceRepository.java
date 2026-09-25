package com.procurelens.frauddetection.repository;

import com.procurelens.frauddetection.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByStatus(String status);
    List<Invoice> findByRiskScoreGreaterThanEqual(Integer minRiskScore);
}
