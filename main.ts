import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { AwsProvider } from './.gen/providers/aws';
import { AzurermProvider } from './.gen/providers/azurerm';
import { Vpc } from './.gen/modules/terraform-aws-modules/vpc/aws';
import { Network } from './.gen/modules/Azure/network/azurerm';

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, 'aws', {
      region: 'us-west-2'
    })

    new AzurermProvider(this, 'azure', {
      features: [{}]
    })

    new Vpc(this, 'myvpc', {
      name: "myvpc",
      cidr: "10.0.0.0/16",
      azs: ["us-west-2a", "us-west-2b"]
    })

    new Network(this, 'myvnet', {
      resourceGroupName: "blakegreen",
      addressSpace: "10.0.0.0/16",
      vnetName: "myvnet"
    })
  }
}  

const app = new App();
const stack = new MyStack(app, 'cdktf-typescript');
stack.addOverride('terraform.backend', {
  remote: {
    hostname: 'app.terraform.io',
    organization: 'GreengoCloud',
    workspaces: {
      name: 'cdktf-_typescript'
    }
  }
});
app.synth();
