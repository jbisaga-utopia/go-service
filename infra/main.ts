/*Provider bindings are generated by running cdktf get.
See https://cdk.tf/provider-generation for more details.*/
import * as google from "./.gen/providers/google";

import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";

const LOCATION = 'us-central1';

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const variables = this.getVariables();

    new google.GoogleProvider(this, "google", {
      project: variables.projectId,
      accessToken: variables.accessToken,
    });
    const googleProjectServiceRunApi = new google.ProjectService(
      this,
      "run_api",
      {
        disableOnDestroy: true,
        service: "run.googleapis.com",
      }
    );
    const service = new google.CloudRunService(this, "run_service", {
      dependsOn: [googleProjectServiceRunApi],
      location: LOCATION,
      name: "go-service-app",
      template: {
        spec: {
          containers: [
            {
              ports: [
                {
                  containerPort: 8081
                }
              ],
              image: `${LOCATION}-docker.pkg.dev/elaborate-leaf-361121/go-service-image/test-image:latest`,
            },
          ],
        },
      },
      traffic: [
        {
          latestRevision: true,
          percent: 100,
        },
      ],
    });

    const policy = new google.DataGoogleIamPolicy(this, 'public', {
      binding: [
        {
          role: "roles/run.invoker",
          members: ["allUsers"]
        }
      ]
    })
    new google.CloudRunServiceIamPolicy(this, "run_service_public", {
      location: LOCATION,
      service: service.name,
      project: variables.projectId,
      policyData: policy.policyData,
    })
  }

  private getVariables() {
    return {
      projectId: process.env.PROJECT_ID,
      accessToken: process.env.ACCESS_TOKEN,
    }
  }
}

const app = new App();
new MyStack(app, "go-service-infra");
app.synth();
