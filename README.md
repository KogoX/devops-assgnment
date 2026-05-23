# Distributed RPC Inference System

A cloud-native distributed inference system built on Google Cloud Platform, demonstrating multi-tier architecture with secure private networking and infrastructure-as-code deployment.

## Quick Start

```bash
# Deploy infrastructure
cd terraform
terraform init
terraform apply

# Destroy resources
terraform destroy
```

---

## Project Overview

This project implements a scalable distributed inference system with:

- **API Gateway** - Public-facing HTTP endpoint that routes requests
- **Python Worker** - FastAPI-based text processing microservice
- **TypeScript Worker** - Express.js-based text processing microservice
- **Private VPC Network** - Secure isolated network for internal communication
- **Infrastructure as Code** - Complete GCP setup via Terraform

All components run on Google Cloud Compute Engine VMs with the API Gateway as the sole public endpoint, while workers remain isolated in a private subnet.

---

## System Architecture

```
┌────────────��──────��─────────────────────────────────┐
│              Public Internet                         │
└────────────────────┬────────────────────────────────┘
                     │ HTTP (Port 3000)
                     ▼
        ┌────────────────────────────┐
        │   API Gateway (Node.js)    │
        │   Public IP + Public Subnet│
        └────────────┬───────────────┘
                     │
        ┌────────────────────────────┐
        │  Private VPC Network       │
        │  10.10.0.0/24              │
        └────────────┬───────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼ (Port 8000)        ▼ (Port 9000)
   ┌─────────────┐      ┌──────────────┐
   │Python Worker│      │TS Worker     │
   │(FastAPI)    │      │(Express.js)  │
   │Private IP   │      │Private IP    │
   └─────────────┘      └──────────────┘
```

---

## API Documentation

### Endpoint: `/infer`

**Method:** `POST`

**Request:**
```json
{
  "text": "hello alchemyst"
}
```

**Response:**
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

**Example:**
```bash
curl -X POST http://<API_GATEWAY_IP>:3000/infer \
  -H "Content-Type: application/json" \
  -d '{"text":"hello alchemyst"}'
```

---

## Service Details

| Service | Framework | Port | Role |
|---------|-----------|------|------|
| **API Gateway** | Node.js + Express | 3000 | Request routing, worker orchestration, response aggregation |
| **Python Worker** | FastAPI | 8000 | Text processing and inference |
| **TypeScript Worker** | Express.js | 9000 | Text processing and inference |

---

## Infrastructure Setup

### Terraform Configuration

The infrastructure is defined in the `terraform/` directory and includes:

**VPC & Networking:**
- VPC Network: `alchemyst-vpc`
- Private Subnet: `10.10.0.0/24`
- Firewall Rules:
  - Internal traffic allowed between all instances
  - Inbound traffic to API Gateway on port 3000 only
  - All outbound traffic allowed

**Compute Resources:**
- `api-gateway` — Public IP, hosts API Gateway
- `python-worker` — Private IP only, runs FastAPI service
- `ts-worker` — Private IP only, runs Express.js service

### Deploy

```bash
cd terraform
terraform init      # Initialize Terraform
terraform plan      # Review planned changes
terraform apply     # Deploy infrastructure
```

### Destroy

```bash
cd terraform
terraform destroy   # Remove all resources
```

---

## Network Architecture

**Security Model:**
- Workers are isolated in a **private subnet** with no public IPs
- Only the **API Gateway** is accessible from the internet
- Communication between services happens over **private IPs**
- Firewall rules restrict traffic to necessary ports only
- No direct internet exposure for worker services

**Benefits:**
- Reduced attack surface
- Secure inter-service communication
- Isolated worker tier
- Single point of entry control

---

## Production Considerations

### Security Hardening

For production deployments, implement:

- [ ] API authentication (JWT tokens, API keys)
- [ ] HTTPS/TLS encryption for all endpoints
- [ ] Cloud IAM policies for service-to-service authentication
- [ ] Request validation and rate limiting
- [ ] VPC Service Controls for network isolation
- [ ] Secret Manager for sensitive configuration
- [ ] Centralized logging (Cloud Logging)
- [ ] Audit logging for compliance

### Monitoring & Observability

- [ ] Health checks and auto-restart policies
- [ ] Request/response logging
- [ ] Performance metrics collection
- [ ] Error tracking and alerting
- [ ] Distributed tracing

### Scaling Strategy

For 100x growth in model size or traffic:

1. **Migrate to Kubernetes (GKE)**
   - Containerize services
   - Horizontal pod autoscaling
   - Service mesh for traffic management

2. **Asynchronous Processing**
   - Pub/Sub for decoupled communication
   - Message queues (Kafka/RabbitMQ)
   - Batch inference processing

3. **Performance Optimization**
   - GPU-accelerated compute instances
   - Request batching
   - Response caching (Redis)
   - Load balancing

4. **Database Layer**
   - Result caching
   - Request deduplication
   - Audit trail storage

---

## Project Structure

```
.
├── terraform/              # Infrastructure definitions
│   ├── main.tf            # VPC, instances, firewall
│   ├── variables.tf       # Configuration variables
│   └── outputs.tf         # Output values
├── gateway/               # API Gateway (Node.js)
│   └── ...
├── python-worker/         # Python Worker (FastAPI)
│   └── ...
├── ts-worker/             # TypeScript Worker (Express.js)
│   └── ...
└── README.md              # This file
```

---

## Technology Stack

| Component | Technology | Usage |
|-----------|-----------|-------|
| **Infrastructure** | Terraform, GCP | Cloud automation, VPC setup |
| **API Gateway** | Node.js, Express.js | Request routing, orchestration |
| **Python Service** | Python, FastAPI | High-performance API framework |
| **TypeScript Service** | TypeScript, Express.js | Type-safe backend service |
| **Networking** | VPC, Cloud Firewall | Isolated network architecture |

---

## Getting Started

### Prerequisites

- Google Cloud Platform account with billing enabled
- Terraform installed locally
- `gcloud` CLI configured with appropriate credentials

### Deployment Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devops-assgnment
   ```

2. **Configure GCP credentials**
   ```bash
   gcloud auth application-default login
   ```

3. **Deploy infrastructure**
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

4. **Access the API**
   ```bash
   API_IP=$(terraform output api_gateway_ip)
   curl -X POST http://$API_IP:3000/infer \
     -H "Content-Type: application/json" \
     -d '{"text":"hello alchemyst"}'
   ```

5. **Clean up** (when finished)
   ```bash
   terraform destroy
   ```

---

## License

This project is part of the Alchemyst DevOps Internship Assignment.
