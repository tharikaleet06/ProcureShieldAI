package com.procurelens.procurement.config;

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
    public OpenAPI procurementOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("ProcureLens - Procurement & Quotation Comparison Microservice")
                .version("v2.4")
                .description("Multi-Vendor Quotation Scoring, Tiered Trade Discounts, CGST/SGST/IGST Tax Calculation, and Landed Cost Engine")
                .license(new License().name("Enterprise Proprietary").url("https://procurelens.internal")))
            .servers(List.of(
                new Server().url("http://localhost:8083").description("Direct Procurement Comparison Service Port"),
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
