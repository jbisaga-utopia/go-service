variable "project_id" {
  type = string
}

terraform {
  backend "gcs" {
    bucket = "go-service-test-github-infra-states"
    prefix = "terraform/state"
  }
}

resource "google_service_account" "sa" {
  project    = var.project_id
  account_id = "github-actions-sa"
}

resource "google_project_iam_member" "project" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.sa.email}"
}

module "oidc" {
  source      = "terraform-google-modules/github-actions-runners/google//modules/gh-oidc"
  project_id  = var.project_id
  pool_id     = "gh-pool"
  provider_id = "gh-provider"
  sa_mapping = {
    (google_service_account.sa.account_id) = {
      sa_name   = google_service_account.sa.name
      attribute = "attribute.repository/user/repo"
    }
  }
}
