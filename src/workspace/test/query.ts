import { examplesResolver } from "test/stub/ipfs";
import examples from "test/examples/packages";

import { WorkspaceQuery } from "ethpm/workspace/query";
import v2 from "ethpm/manifest/v2";


it("resolves package-level contract types", async () => {
  let query = new WorkspaceQuery({
    package: examples["standard-token"],
    resolver: examplesResolver,
    read: v2.read,
  });

  const standardToken = await query.contractType("StandardToken");

  expect(standardToken).toEqual(
    examples["standard-token"].contractTypes["StandardToken"]
  );
});

it("resolves deployed instances", async () => {
  let query = new WorkspaceQuery({
    package: examples["piper-coin"],
    resolver: examplesResolver,
    read: v2.read,
  });

  const [chain] = examples["piper-coin"].deployments.keys()
  const deployment = examples["piper-coin"].deployments.get(chain) || {};

  const expectedInstance = deployment["PiperCoin"];

  const piperCoin = await query.contractInstance(chain, "PiperCoin");

  expect(piperCoin).toEqual(expectedInstance);

});

it("resolves build dependencies", async () => {
  let query = new WorkspaceQuery({
    package: examples["piper-coin"],
    resolver: examplesResolver,
    read: v2.read,
  });

  const standardToken = await query.buildDependency("standard-token");

  expect(standardToken).toEqual(examples["standard-token"]);
});


it("resolves contract types from a dependent package", async () => {
  let query = new WorkspaceQuery({
    package: examples["piper-coin"],
    resolver: examplesResolver,
    read: v2.read,
  });

  const standardToken = await query.contractType("standard-token:StandardToken");
  const expected = examples["standard-token"].contractTypes["StandardToken"];

  expect(standardToken).toEqual(expected);
});

it("resolves contract types from a dependency's dependency", async () => {
  let query = new WorkspaceQuery({
    package: examples["wallet-with-send"],
    resolver: examplesResolver,
    read: v2.read,
  });

  const ref = "wallet:safe-math-lib:SafeMathLib";

  const standardToken = await query.contractType(ref);
  const expected = examples["safe-math-lib"].contractTypes["SafeMathLib"];

  expect(standardToken).toEqual(expected);
});
