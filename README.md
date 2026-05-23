# Alchemyst DevOps Internship Assignment — Distributed RPC Inference System

## Overview

This project implements a distributed inference system deployed across multiple Google Cloud Compute Engine VMs inside a private VPC network. The system consists of:

- A public-facing API Gateway (Node.js)
- A Python worker (FastAPI)
- A TypeScript worker (Express.js)
- Private subnet communication using internal IPs
- Infrastructure fully provisioned using Terraform

The API Gateway receives HTTP JSON requests and dispatches them to backend workers via RPC-style HTTP calls over a private network.

---

## Architecture
       [Public Internet]
               │
               ▼ (Port 3000)
    ┌───────────────────────────┐
    │    API Gateway (Node.js)  │  <-- Public Subnet (External IP)
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


---

## Infrastructure (Terraform)

All infrastructure is fully reproducible using Terraform.

### Resources created:
- VPC Network (`alchemyst-vpc`)
- Private Subnet (`10.10.0.0/24`)
- Firewall rules:
  - Internal communication allowed within subnet
  - Public access only to API Gateway
- Compute Engine instances:
  - api-gateway (public IP)
  - python-worker (private IP only)
  - ts-worker (private IP only)

### Deployment

```bash
cd terraform
terraform init
terraform apply
To destroy:

terraform destroy
API Specification
Endpoint
POST /infer
Request
{
  "text": "hello alchemyst"
}
Response
{
  "gateway": "success",
  "python": {
    "python_worker": "Processed: hello alchemyst"
  },
  "typescript": {
    "ts_worker": "TS processed: hello alchemyst"
  }
}
Example Usage
curl -X POST http://<API_GATEWAY_EXTERNAL_IP>:3000/infer \
-H "Content-Type: application/json" \
-d '{"text":"hello alchemyst"}'
Worker Design
Python Worker
Framework: FastAPI
Port: 8000
Function: Processes input text and returns response
TypeScript Worker
Framework: Express.js
Port: 9000
Function: Processes input text and returns response
API Gateway
Framework: Node.js + Express
Port: 3000
Role:
Accepts HTTP requests
Sends RPC calls to workers
Aggregates responses
Network Design
Workers are deployed in a private subnet (10.10.0.0/24)
Only API Gateway has a public IP
Internal communication happens via private IPs
No worker is exposed to the internet
Security Considerations (Production Hardening)

If deployed in production, the following improvements are recommended:

Replace open firewall rules with strict service-to-service IAM policies
Use HTTPS (TLS termination at gateway)
Add authentication (API keys / JWT)
Restrict ingress IP ranges for API gateway
Use centralized logging (Cloud Logging / ELK stack)
Implement health checks and auto-restart policies
Use secret manager for sensitive configuration
Scaling Considerations (If Model is 100x Larger)
Move from VM-based architecture to Kubernetes (GKE)
Introduce message queues (Pub/Sub / Kafka) for async inference
Implement batching for inference requests
Use GPU-backed instances for workers
Add caching layer (Redis)
Implement horizontal autoscaling for workers
Reproducibility

This project is fully reproducible:

Run Terraform
SSH into instances
Install dependencies
Start services
Test API endpoint

No manual cloud console configuration is required beyond initial setup.
