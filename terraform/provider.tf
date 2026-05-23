terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "alchemyst-devops-497117"
  region  = "us-central1"
  zone    = "us-central1-a"
}
