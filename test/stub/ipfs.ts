import { URL } from "url";

import { Maybe } from "types";
import getHash from "ethpm/storage/ipfs/hash";
import examples from "test/examples/manifests";

export class Resolver {
  private contents: Record<string, string>;

  constructor () {
    this.contents = {};
  }

  async add (content: string) {
    const hash = await getHash(content);
    this.contents[`ipfs://${hash}`] = content;
  }

  async get (uri: string | URL): Promise<Maybe<string>> {
    if (uri instanceof URL) {
      uri = uri.href;
    }
    return this.contents[uri];
  }
}

export class ExamplesResolver extends Resolver {
  private ready: Promise<any>;

  constructor () {
    super();

    this.ready = Promise.all(
      Object.values(examples).map(async (manifest) => {
        await this.add(manifest)
      })
    );
  }

  async get (uri: any): Promise<Maybe<string>> {
    await this.ready;

    return await super.get(uri);
  }
}

const examplesResolver = new ExamplesResolver();

export { examplesResolver };
