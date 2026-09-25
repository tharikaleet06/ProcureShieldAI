package com.procurelens.frauddetection.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI fraudDetectionOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("ProcureLens - Fraud Detection & Forensic Risk Microservice")
                .version("v2.4")
                .description("Empirical Multi-Model Anomaly Scoring, Z-Score Multiplier Deviation, Benford's Law, and ERP Disbursement Holds")
                .license(new License().name("Enterprise Proprietary").url("https://procurelens.internal")))
            .servers(List.of(
                new Server().url("http://localhost:8082").description("Direct Fraud Detection Port"),
                new Server().url("http://localhost:3000/api").description("Edge Reverse Proxy")
            ))
            .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
            .components(new Components()
                .addSecuritySchemes("BearerAuth",
                    new SecurityScheme()
                        .name("BearerAuth")
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
