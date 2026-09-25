package com.procurelens.procurement.repository;

import com.procurelens.procurement.model.ProcurementQuote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProcurementQuoteRepository extends JpaRepository<ProcurementQuote, String> {
    List<ProcurementQuote> findByProcurementId(String procurementId);
}
