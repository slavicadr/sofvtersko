package com.fakultet.dobrobit.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String getBaseUrl() {
        return "sandbox".equals(mode)
                ? "https://api-m.sandbox.paypal.com"
                : "https://api-m.paypal.com";
    }

    private String getAccessToken() throws Exception {
        String credentials = Base64.getEncoder().encodeToString(
                (clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(getBaseUrl() + "/v1/oauth2/token"))
                .header("Authorization", "Basic " + credentials)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials"))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("PayPal auth failed: " + response.body());
        }

        Map<String, Object> body = objectMapper.readValue(response.body(), Map.class);
        return (String) body.get("access_token");
    }

    public Map<String, Object> createOrder(double amount) throws Exception {
        String accessToken = getAccessToken();
        String formattedAmount = String.format("%.2f", amount);

        String requestBody = String.format("""
                {
                  "intent": "CAPTURE",
                  "purchase_units": [{
                    "amount": {
                      "currency_code": "USD",
                      "value": "%s"
                    }
                  }]
                }
                """, formattedAmount);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(getBaseUrl() + "/v2/checkout/orders"))
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 201) {
            throw new RuntimeException("PayPal createOrder failed: " + response.body());
        }

        return objectMapper.readValue(response.body(), Map.class);
    }

    public Map<String, Object> captureOrder(String orderId) throws Exception {
        String accessToken = getAccessToken();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(getBaseUrl() + "/v2/checkout/orders/" + orderId + "/capture"))
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(""))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 201 && response.statusCode() != 200) {
            throw new RuntimeException("PayPal captureOrder failed: " + response.body());
        }

        return objectMapper.readValue(response.body(), Map.class);
    }
}
