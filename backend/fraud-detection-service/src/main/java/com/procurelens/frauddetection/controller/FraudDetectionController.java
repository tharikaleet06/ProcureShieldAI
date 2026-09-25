package com.procurelens.frauddetection.controller;

import com.procurelens.frauddetection.model.Invoice;
import com.procurelens.frauddetection.service.ProcurementRiskAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Tag(name = "Forensic Anomaly & Fraud Engine", description = "Python 3 AI empirical forensic kernel orchestration, multi-model analysis, and ERP payment holds")
@SecurityRequirement(name = "BearerAuth")
@RestController
@RequestMapping("/api/v1/fraud-detection")
@CrossOrigin(origins = "*")
public class FraudDetectionController {

    @Autowired
    private ProcurementRiskAnalysisService riskAnalysisService;

    @Operation(
        summary = "Calculate rule-based & statistical risk score",
        description = "Evaluates invoice against multi-quarter price baselines, Z-score outliers, and statutory compliance limits."
    )
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeRisk(@RequestBody Invoice invoice) {
        ProcurementRiskAnalysisService.RiskAnalysisResult result = riskAnalysisService.analyzeInvoiceRisk(invoice);
        return ResponseEntity.ok(result);
    }

    @Operation(
        summary = "Execute full AI forensic anomaly analysis",
        description = "Streams invoice payload to the Python 3 Empirical Forensic Kernel to compute Isolation Forest, Autoencoder, BGE Semantic, and NetworkX Graph outputs."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Forensic audit dossier generated successfully"),
        @ApiResponse(responseCode = "500", description = "AI pipeline execution error")
    })
    @PostMapping("/investigate")
    public ResponseEntity<?> investigateAnomaly(@RequestBody Map<String, Object> transactionPayload) {
        try {
            String scriptPath = System.getenv().getOrDefault("AI_SCRIPT_PATH", "ai_modules/forensic_engine.py");
            ProcessBuilder pb = new ProcessBuilder("python3", scriptPath);
            Process process = pb.start();

            String jsonInput = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(transactionPayload);
            process.getOutputStream().write(jsonInput.getBytes(StandardCharsets.UTF_8));
            process.getOutputStream().flush();
            process.getOutputStream().close();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            process.waitFor();

            String output = sb.toString();
            return ResponseEntity.ok(output);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "error", "Forensic AI analysis execution failed",
                "message", e.getMessage()
            ));
        }
    }
}
