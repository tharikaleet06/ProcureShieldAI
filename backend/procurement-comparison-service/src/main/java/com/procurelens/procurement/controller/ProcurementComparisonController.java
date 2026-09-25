package com.procurelens.procurement.controller;

import com.procurelens.procurement.dto.QuoteCalculationRequest;
import com.procurelens.procurement.dto.QuoteCalculationResponse;
import com.procurelens.procurement.dto.ProcurementComparisonResponse;
import com.procurelens.procurement.service.ProcurementComparisonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "Procurement & Quotations", description = "Multi-vendor quote comparison, GST/tax reconciliation, and discount optimization engine")
@RestController
@RequestMapping("/api/v1/procurements")
@CrossOrigin(origins = "*")
public class ProcurementComparisonController {

    @Autowired
    private ProcurementComparisonService comparisonService;

    @Operation(summary = "Calculate and validate single vendor quote")
    @PostMapping("/calculate-quote")
    public ResponseEntity<QuoteCalculationResponse> calculateQuote(@RequestBody QuoteCalculationRequest request) {
        QuoteCalculationResponse response = comparisonService.calculateSingleQuote(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Compare multiple vendor quotations and rank optimal vendor")
    @PostMapping("/compare")
    public ResponseEntity<ProcurementComparisonResponse> compareQuotes(
        @RequestBody List<QuoteCalculationRequest> quoteRequests,
        @RequestParam(required = false, defaultValue = "Multi-Vendor Comparison") String title,
        @RequestParam(required = false, defaultValue = "Machinery & Equipment") String category,
        @RequestParam(required = false, defaultValue = "Maharashtra") String buyerState,
        @RequestParam(required = false, defaultValue = "18.00") BigDecimal gstRate
    ) {
        ProcurementComparisonResponse response = comparisonService.compareQuotations(
            quoteRequests, title, category, buyerState, gstRate
        );
        return ResponseEntity.ok(response);
    }
}
