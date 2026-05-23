# Alchemyst DevOps Internship Assignment — Distributed RPC Inference System

## Overview

This project implements a distributed inference system deployed across multiple Google Cloud Compute Engine VMs within a private VPC network. The system consists of:

- **API Gateway** (Node.js/Express) - Public-facing endpoint
- **Python Worker** (FastAPI) - Text processing service
- **TypeScript Worker** (Express.js) - Text processing service
- **Private VPC Network** - Secure inter-service communication
- **Infrastructure as Code** - Fully provisioned using Terraform

The API Gateway accepts HTTP JSON requests and dispatches them to backend workers via RPC-style HTTP calls over a private network.

---

## Architecture

```
        [Public Internet]
                │
                ▼ (Port 3000)
     ┌───────────────────────────┐
     │    API Gateway (Node.js)  │  ← Public Subnet (External IP)
     └──────────┬────────────────┘
                │
     [Private VPC Subnet / Internal IPs only]
                │
       ┌────────┴────────┐
       ▼ (Port 8000)     ▼ (Port 9000)
 ┌────────────┐    ┌─────────────┐
 │ Python VM  │    │ TS Worker VM│
 │ (FastAPI)  │    │ (Express)   │
 └────────────┘    └─────────────┘
```

---

## Infrastructure (Terraform)

All infrastructure is fully reproducible using Terraform.

### Resources Created

- **VPC Network**: `alchemyst-vpc`
- **Private Subnet**: `10.10.0.0/24`
- **Firewall Rules**:
  - Internal communication allowed within subnet
  - Public access restricted to API Gateway only
- **Compute Engine Instances**:
  - `api-gateway` (public IP)
  - `python-worker` (private IP only)
  - `ts-worker` (private IP only)

### Deployment

```bash
cd terraform
terraform init
terraform apply
```

### Cleanup

```bash
terraform destroy
```

---

## API Specification

### Endpoint

```
POST /infer
```

### Request

```json
{
  "text": "hello alchemyst"
}
```

### Response

```json
{
  "gateway": "success",
  "python": {
    "python_worker": "Processed: hello alchemyst"
  },
  "typescript": {
    "ts_worker": "TS processed: hello alchemyst"
  }
}
```

### Example Usage

```bash
curl -X POST http://<API_GATEWAY_EXTERNAL_IP>:3000/infer \
  -H "Content-Type: application/json" \
  -d '{"text":"hello alchemyst"}'
```

---

## Service Components

### Python Worker

| Property | Value |
|----------|-------|
| **Framework** | FastAPI |
| **Port** | 8000 |
| **Function** | Processes input text and returns response |

### TypeScript Worker

| Property | Value |
|----------|-------|
| **Framework** | Express.js |
| **Port** | 9000 |
| **Function** | Processes input text and returns response |

### API Gateway

| Property | Value |
|----------|-------|
| **Framework** | Node.js + Express |
| **Port** | 3000 |
| **Role** | Accepts HTTP requests, sends RPC calls to workers, aggregates responses |

---

## Network Design

- Workers are deployed in a **private subnet** (`10.10.0.0/24`)
- Only **API Gateway** has a public IP address
- **Internal communication** uses private IPs only
- **No worker** is exposed to the internet

---

## Security Considerations (Production Hardening)

For production deployments, implement the following:

- [ ] Replace open firewall rules with strict service-to-service IAM policies
- [ ] Enable HTTPS with TLS termination at the gateway
- [ ] Add authentication (API keys / JWT tokens)
- [ ] Restrict ingress IP ranges for API gateway
- [ ] Implement centralized logging (Cloud Logging / ELK stack)
- [ ] Configure health checks and auto-restart policies
- [ ] Use Secret Manager for sensitive configuration

---

## Scaling Considerations

For handling 100x larger models or increased traffic:

- Migrate from VM-based architecture to **Kubernetes (GKE)**
- Introduce **message queues** (Pub/Sub / Kafka) for async inference
- Implement **request batching** for inference optimization
- Use **GPU-backed instances** for workers
- Add **caching layer** (Redis)
- Enable **horizontal autoscaling** for workers

---

## Reproducibility

This project is fully reproducible with minimal manual configuration:

1. Run Terraform to provision infrastructure
2. SSH into instances
3. Install service dependencies
4. Start services
5. Test API endpoint

No manual cloud console configuration is required beyond initial setup.

---

## Technologies Used

- **HCL** (62.9%) - Terraform infrastructure definitions
- **JavaScript** (28.8%) - API Gateway and TypeScript Worker
- **Python** (8.3%) - Python Worker with FastAPI
