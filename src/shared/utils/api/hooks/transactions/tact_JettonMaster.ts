import {
  Cell,
  Slice,
  Address,
  Builder,
  beginCell,
  ComputeError,
  TupleItem,
  TupleReader,
  Dictionary,
  contractAddress,
  ContractProvider,
  Sender,
  Contract,
  ContractABI,
  ABIType,
  ABIGetter,
  ABIReceiver,
  TupleBuilder,
  DictionaryValue,
} from 'ton-core';

export type StateInit = {
  $$type: 'StateInit';
  code: Cell;
  data: Cell;
};

export function storeStateInit(src: StateInit) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeRef(src.code);
    b_0.storeRef(src.data);
  };
}

export function loadStateInit(slice: Slice) {
  let sc_0 = slice;
  let _code = sc_0.loadRef();
  let _data = sc_0.loadRef();
  return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
  let _code = source.readCell();
  let _data = source.readCell();
  return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
  let _code = source.readCell();
  let _data = source.readCell();
  return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
  let builder = new TupleBuilder();
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
    },
    parse: (src) => {
      return loadStateInit(src.loadRef().beginParse());
    },
  };
}

export type StdAddress = {
  $$type: 'StdAddress';
  workchain: bigint;
  address: bigint;
};

export function storeStdAddress(src: StdAddress) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeInt(src.workchain, 8);
    b_0.storeUint(src.address, 256);
  };
}

export function loadStdAddress(slice: Slice) {
  let sc_0 = slice;
  let _workchain = sc_0.loadIntBig(8);
  let _address = sc_0.loadUintBig(256);
  return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
  let _workchain = source.readBigNumber();
  let _address = source.readBigNumber();
  return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
  let _workchain = source.readBigNumber();
  let _address = source.readBigNumber();
  return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.workchain);
  builder.writeNumber(source.address);
  return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
    },
    parse: (src) => {
      return loadStdAddress(src.loadRef().beginParse());
    },
  };
}

export type VarAddress = {
  $$type: 'VarAddress';
  workchain: bigint;
  address: Slice;
};

export function storeVarAddress(src: VarAddress) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeInt(src.workchain, 32);
    b_0.storeRef(src.address.asCell());
  };
}

export function loadVarAddress(slice: Slice) {
  let sc_0 = slice;
  let _workchain = sc_0.loadIntBig(32);
  let _address = sc_0.loadRef().asSlice();
  return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
  let _workchain = source.readBigNumber();
  let _address = source.readCell().asSlice();
  return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
  let _workchain = source.readBigNumber();
  let _address = source.readCell().asSlice();
  return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.workchain);
  builder.writeSlice(source.address.asCell());
  return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
    },
    parse: (src) => {
      return loadVarAddress(src.loadRef().beginParse());
    },
  };
}

export type Context = {
  $$type: 'Context';
  bounced: boolean;
  sender: Address;
  value: bigint;
  raw: Slice;
};

export function storeContext(src: Context) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.bounced);
    b_0.storeAddress(src.sender);
    b_0.storeInt(src.value, 257);
    b_0.storeRef(src.raw.asCell());
  };
}

export function loadContext(slice: Slice) {
  let sc_0 = slice;
  let _bounced = sc_0.loadBit();
  let _sender = sc_0.loadAddress();
  let _value = sc_0.loadIntBig(257);
  let _raw = sc_0.loadRef().asSlice();
  return {
    $$type: 'Context' as const,
    bounced: _bounced,
    sender: _sender,
    value: _value,
    raw: _raw,
  };
}

function loadTupleContext(source: TupleReader) {
  let _bounced = source.readBoolean();
  let _sender = source.readAddress();
  let _value = source.readBigNumber();
  let _raw = source.readCell().asSlice();
  return {
    $$type: 'Context' as const,
    bounced: _bounced,
    sender: _sender,
    value: _value,
    raw: _raw,
  };
}

function loadGetterTupleContext(source: TupleReader) {
  let _bounced = source.readBoolean();
  let _sender = source.readAddress();
  let _value = source.readBigNumber();
  let _raw = source.readCell().asSlice();
  return {
    $$type: 'Context' as const,
    bounced: _bounced,
    sender: _sender,
    value: _value,
    raw: _raw,
  };
}

function storeTupleContext(source: Context) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.bounced);
  builder.writeAddress(source.sender);
  builder.writeNumber(source.value);
  builder.writeSlice(source.raw.asCell());
  return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeContext(src)).endCell());
    },
    parse: (src) => {
      return loadContext(src.loadRef().beginParse());
    },
  };
}

export type SendParameters = {
  $$type: 'SendParameters';
  bounce: boolean;
  to: Address;
  value: bigint;
  mode: bigint;
  body: Cell | null;
  code: Cell | null;
  data: Cell | null;
};

export function storeSendParameters(src: SendParameters) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.bounce);
    b_0.storeAddress(src.to);
    b_0.storeInt(src.value, 257);
    b_0.storeInt(src.mode, 257);
    if (src.body !== null && src.body !== undefined) {
      b_0.storeBit(true).storeRef(src.body);
    } else {
      b_0.storeBit(false);
    }
    if (src.code !== null && src.code !== undefined) {
      b_0.storeBit(true).storeRef(src.code);
    } else {
      b_0.storeBit(false);
    }
    if (src.data !== null && src.data !== undefined) {
      b_0.storeBit(true).storeRef(src.data);
    } else {
      b_0.storeBit(false);
    }
  };
}

export function loadSendParameters(slice: Slice) {
  let sc_0 = slice;
  let _bounce = sc_0.loadBit();
  let _to = sc_0.loadAddress();
  let _value = sc_0.loadIntBig(257);
  let _mode = sc_0.loadIntBig(257);
  let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
  return {
    $$type: 'SendParameters' as const,
    bounce: _bounce,
    to: _to,
    value: _value,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
  };
}

function loadTupleSendParameters(source: TupleReader) {
  let _bounce = source.readBoolean();
  let _to = source.readAddress();
  let _value = source.readBigNumber();
  let _mode = source.readBigNumber();
  let _body = source.readCellOpt();
  let _code = source.readCellOpt();
  let _data = source.readCellOpt();
  return {
    $$type: 'SendParameters' as const,
    bounce: _bounce,
    to: _to,
    value: _value,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
  };
}

function loadGetterTupleSendParameters(source: TupleReader) {
  let _bounce = source.readBoolean();
  let _to = source.readAddress();
  let _value = source.readBigNumber();
  let _mode = source.readBigNumber();
  let _body = source.readCellOpt();
  let _code = source.readCellOpt();
  let _data = source.readCellOpt();
  return {
    $$type: 'SendParameters' as const,
    bounce: _bounce,
    to: _to,
    value: _value,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
  };
}

function storeTupleSendParameters(source: SendParameters) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.bounce);
  builder.writeAddress(source.to);
  builder.writeNumber(source.value);
  builder.writeNumber(source.mode);
  builder.writeCell(source.body);
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
    },
    parse: (src) => {
      return loadSendParameters(src.loadRef().beginParse());
    },
  };
}

export type Deploy = {
  $$type: 'Deploy';
  queryId: bigint;
};

export function storeDeploy(src: Deploy) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2490013878, 32);
    b_0.storeUint(src.queryId, 64);
  };
}

export function loadDeploy(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2490013878) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
  let _queryId = source.readBigNumber();
  return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
  let _queryId = source.readBigNumber();
  return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
    },
    parse: (src) => {
      return loadDeploy(src.loadRef().beginParse());
    },
  };
}

export type DeployOk = {
  $$type: 'DeployOk';
  queryId: bigint;
};

export function storeDeployOk(src: DeployOk) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2952335191, 32);
    b_0.storeUint(src.queryId, 64);
  };
}

export function loadDeployOk(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2952335191) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
  let _queryId = source.readBigNumber();
  return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
  let _queryId = source.readBigNumber();
  return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
    },
    parse: (src) => {
      return loadDeployOk(src.loadRef().beginParse());
    },
  };
}

export type FactoryDeploy = {
  $$type: 'FactoryDeploy';
  queryId: bigint;
  cashback: Address;
};

export function storeFactoryDeploy(src: FactoryDeploy) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1829761339, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeAddress(src.cashback);
  };
}

export function loadFactoryDeploy(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1829761339) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  let _cashback = sc_0.loadAddress();
  return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _cashback = source.readAddress();
  return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _cashback = source.readAddress();
  return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeAddress(source.cashback);
  return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
    },
    parse: (src) => {
      return loadFactoryDeploy(src.loadRef().beginParse());
    },
  };
}

export type ChangeOwner = {
  $$type: 'ChangeOwner';
  queryId: bigint;
  newOwner: Address;
};

export function storeChangeOwner(src: ChangeOwner) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2174598809, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeAddress(src.newOwner);
  };
}

export function loadChangeOwner(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2174598809) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  let _newOwner = sc_0.loadAddress();
  return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _newOwner = source.readAddress();
  return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwner(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _newOwner = source.readAddress();
  return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeAddress(source.newOwner);
  return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
    },
    parse: (src) => {
      return loadChangeOwner(src.loadRef().beginParse());
    },
  };
}

export type ChangeOwnerOk = {
  $$type: 'ChangeOwnerOk';
  queryId: bigint;
  newOwner: Address;
};

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(846932810, 32);
    b_0.storeUint(src.queryId, 64);
    b_0.storeAddress(src.newOwner);
  };
}

export function loadChangeOwnerOk(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 846932810) {
    throw Error('Invalid prefix');
  }
  let _queryId = sc_0.loadUintBig(64);
  let _newOwner = sc_0.loadAddress();
  return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwnerOk(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _newOwner = source.readAddress();
  return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadGetterTupleChangeOwnerOk(source: TupleReader) {
  let _queryId = source.readBigNumber();
  let _newOwner = source.readAddress();
  return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.queryId);
  builder.writeAddress(source.newOwner);
  return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
    },
    parse: (src) => {
      return loadChangeOwnerOk(src.loadRef().beginParse());
    },
  };
}

export type UnlockMyWallet = {
  $$type: 'UnlockMyWallet';
};

export function storeUnlockMyWallet(src: UnlockMyWallet) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3955656361, 32);
  };
}

export function loadUnlockMyWallet(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3955656361) {
    throw Error('Invalid prefix');
  }
  return { $$type: 'UnlockMyWallet' as const };
}

function loadTupleUnlockMyWallet(source: TupleReader) {
  return { $$type: 'UnlockMyWallet' as const };
}

function loadGetterTupleUnlockMyWallet(source: TupleReader) {
  return { $$type: 'UnlockMyWallet' as const };
}

function storeTupleUnlockMyWallet(source: UnlockMyWallet) {
  let builder = new TupleBuilder();
  return builder.build();
}

function dictValueParserUnlockMyWallet(): DictionaryValue<UnlockMyWallet> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeUnlockMyWallet(src)).endCell());
    },
    parse: (src) => {
      return loadUnlockMyWallet(src.loadRef().beginParse());
    },
  };
}

export type UnlockMe = {
  $$type: 'UnlockMe';
};

export function storeUnlockMe(src: UnlockMe) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(238808378, 32);
  };
}

export function loadUnlockMe(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 238808378) {
    throw Error('Invalid prefix');
  }
  return { $$type: 'UnlockMe' as const };
}

function loadTupleUnlockMe(source: TupleReader) {
  return { $$type: 'UnlockMe' as const };
}

function loadGetterTupleUnlockMe(source: TupleReader) {
  return { $$type: 'UnlockMe' as const };
}

function storeTupleUnlockMe(source: UnlockMe) {
  let builder = new TupleBuilder();
  return builder.build();
}

function dictValueParserUnlockMe(): DictionaryValue<UnlockMe> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeUnlockMe(src)).endCell());
    },
    parse: (src) => {
      return loadUnlockMe(src.loadRef().beginParse());
    },
  };
}

export type ChangeWalletStatus = {
  $$type: 'ChangeWalletStatus';
  wallet_owner: Address;
  newStatus: boolean;
};

export function storeChangeWalletStatus(src: ChangeWalletStatus) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3398027824, 32);
    b_0.storeAddress(src.wallet_owner);
    b_0.storeBit(src.newStatus);
  };
}

export function loadChangeWalletStatus(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3398027824) {
    throw Error('Invalid prefix');
  }
  let _wallet_owner = sc_0.loadAddress();
  let _newStatus = sc_0.loadBit();
  return {
    $$type: 'ChangeWalletStatus' as const,
    wallet_owner: _wallet_owner,
    newStatus: _newStatus,
  };
}

function loadTupleChangeWalletStatus(source: TupleReader) {
  let _wallet_owner = source.readAddress();
  let _newStatus = source.readBoolean();
  return {
    $$type: 'ChangeWalletStatus' as const,
    wallet_owner: _wallet_owner,
    newStatus: _newStatus,
  };
}

function loadGetterTupleChangeWalletStatus(source: TupleReader) {
  let _wallet_owner = source.readAddress();
  let _newStatus = source.readBoolean();
  return {
    $$type: 'ChangeWalletStatus' as const,
    wallet_owner: _wallet_owner,
    newStatus: _newStatus,
  };
}

function storeTupleChangeWalletStatus(source: ChangeWalletStatus) {
  let builder = new TupleBuilder();
  builder.writeAddress(source.wallet_owner);
  builder.writeBoolean(source.newStatus);
  return builder.build();
}

function dictValueParserChangeWalletStatus(): DictionaryValue<ChangeWalletStatus> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeChangeWalletStatus(src)).endCell());
    },
    parse: (src) => {
      return loadChangeWalletStatus(src.loadRef().beginParse());
    },
  };
}

export type WalletOrder = {
  $$type: 'WalletOrder';
  newStatus: boolean;
};

export function storeWalletOrder(src: WalletOrder) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(954660261, 32);
    b_0.storeBit(src.newStatus);
  };
}

export function loadWalletOrder(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 954660261) {
    throw Error('Invalid prefix');
  }
  let _newStatus = sc_0.loadBit();
  return { $$type: 'WalletOrder' as const, newStatus: _newStatus };
}

function loadTupleWalletOrder(source: TupleReader) {
  let _newStatus = source.readBoolean();
  return { $$type: 'WalletOrder' as const, newStatus: _newStatus };
}

function loadGetterTupleWalletOrder(source: TupleReader) {
  let _newStatus = source.readBoolean();
  return { $$type: 'WalletOrder' as const, newStatus: _newStatus };
}

function storeTupleWalletOrder(source: WalletOrder) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.newStatus);
  return builder.build();
}

function dictValueParserWalletOrder(): DictionaryValue<WalletOrder> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeWalletOrder(src)).endCell());
    },
    parse: (src) => {
      return loadWalletOrder(src.loadRef().beginParse());
    },
  };
}

export type Mint = {
  $$type: 'Mint';
  amount: bigint;
  receiver: Address;
};

export function storeMint(src: Mint) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(4235234258, 32);
    b_0.storeInt(src.amount, 257);
    b_0.storeAddress(src.receiver);
  };
}

export function loadMint(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 4235234258) {
    throw Error('Invalid prefix');
  }
  let _amount = sc_0.loadIntBig(257);
  let _receiver = sc_0.loadAddress();
  return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function loadTupleMint(source: TupleReader) {
  let _amount = source.readBigNumber();
  let _receiver = source.readAddress();
  return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function loadGetterTupleMint(source: TupleReader) {
  let _amount = source.readBigNumber();
  let _receiver = source.readAddress();
  return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function storeTupleMint(source: Mint) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.amount);
  builder.writeAddress(source.receiver);
  return builder.build();
}

function dictValueParserMint(): DictionaryValue<Mint> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeMint(src)).endCell());
    },
    parse: (src) => {
      return loadMint(src.loadRef().beginParse());
    },
  };
}

export type MintClose = {
  $$type: 'MintClose';
};

export function storeMintClose(src: MintClose) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3040496651, 32);
  };
}

export function loadMintClose(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3040496651) {
    throw Error('Invalid prefix');
  }
  return { $$type: 'MintClose' as const };
}

function loadTupleMintClose(source: TupleReader) {
  return { $$type: 'MintClose' as const };
}

function loadGetterTupleMintClose(source: TupleReader) {
  return { $$type: 'MintClose' as const };
}

function storeTupleMintClose(source: MintClose) {
  let builder = new TupleBuilder();
  return builder.build();
}

function dictValueParserMintClose(): DictionaryValue<MintClose> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeMintClose(src)).endCell());
    },
    parse: (src) => {
      return loadMintClose(src.loadRef().beginParse());
    },
  };
}

export type JettonWallet$Data = {
  $$type: 'JettonWallet$Data';
  balance: bigint;
  owner: Address;
  master: Address;
  sendingEnabled: boolean;
};

export function storeJettonWallet$Data(src: JettonWallet$Data) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeCoins(src.balance);
    b_0.storeAddress(src.owner);
    b_0.storeAddress(src.master);
    b_0.storeBit(src.sendingEnabled);
  };
}

export function loadJettonWallet$Data(slice: Slice) {
  let sc_0 = slice;
  let _balance = sc_0.loadCoins();
  let _owner = sc_0.loadAddress();
  let _master = sc_0.loadAddress();
  let _sendingEnabled = sc_0.loadBit();
  return {
    $$type: 'JettonWallet$Data' as const,
    balance: _balance,
    owner: _owner,
    master: _master,
    sendingEnabled: _sendingEnabled,
  };
}

function loadTupleJettonWallet$Data(source: TupleReader) {
  let _balance = source.readBigNumber();
  let _owner = source.readAddress();
  let _master = source.readAddress();
  let _sendingEnabled = source.readBoolean();
  return {
    $$type: 'JettonWallet$Data' as const,
    balance: _balance,
    owner: _owner,
    master: _master,
    sendingEnabled: _sendingEnabled,
  };
}

function loadGetterTupleJettonWallet$Data(source: TupleReader) {
  let _balance = source.readBigNumber();
  let _owner = source.readAddress();
  let _master = source.readAddress();
  let _sendingEnabled = source.readBoolean();
  return {
    $$type: 'JettonWallet$Data' as const,
    balance: _balance,
    owner: _owner,
    master: _master,
    sendingEnabled: _sendingEnabled,
  };
}

function storeTupleJettonWallet$Data(source: JettonWallet$Data) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.balance);
  builder.writeAddress(source.owner);
  builder.writeAddress(source.master);
  builder.writeBoolean(source.sendingEnabled);
  return builder.build();
}

function dictValueParserJettonWallet$Data(): DictionaryValue<JettonWallet$Data> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeJettonWallet$Data(src)).endCell());
    },
    parse: (src) => {
      return loadJettonWallet$Data(src.loadRef().beginParse());
    },
  };
}

export type JettonMaster$Data = {
  $$type: 'JettonMaster$Data';
  total_supply: bigint;
  owner: Address;
  content: Cell;
  mintable: boolean;
  publicUnlock: boolean;
};

export function storeJettonMaster$Data(src: JettonMaster$Data) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeCoins(src.total_supply);
    b_0.storeAddress(src.owner);
    b_0.storeRef(src.content);
    b_0.storeBit(src.mintable);
    b_0.storeBit(src.publicUnlock);
  };
}

export function loadJettonMaster$Data(slice: Slice) {
  let sc_0 = slice;
  let _total_supply = sc_0.loadCoins();
  let _owner = sc_0.loadAddress();
  let _content = sc_0.loadRef();
  let _mintable = sc_0.loadBit();
  let _publicUnlock = sc_0.loadBit();
  return {
    $$type: 'JettonMaster$Data' as const,
    total_supply: _total_supply,
    owner: _owner,
    content: _content,
    mintable: _mintable,
    publicUnlock: _publicUnlock,
  };
}

function loadTupleJettonMaster$Data(source: TupleReader) {
  let _total_supply = source.readBigNumber();
  let _owner = source.readAddress();
  let _content = source.readCell();
  let _mintable = source.readBoolean();
  let _publicUnlock = source.readBoolean();
  return {
    $$type: 'JettonMaster$Data' as const,
    total_supply: _total_supply,
    owner: _owner,
    content: _content,
    mintable: _mintable,
    publicUnlock: _publicUnlock,
  };
}

function loadGetterTupleJettonMaster$Data(source: TupleReader) {
  let _total_supply = source.readBigNumber();
  let _owner = source.readAddress();
  let _content = source.readCell();
  let _mintable = source.readBoolean();
  let _publicUnlock = source.readBoolean();
  return {
    $$type: 'JettonMaster$Data' as const,
    total_supply: _total_supply,
    owner: _owner,
    content: _content,
    mintable: _mintable,
    publicUnlock: _publicUnlock,
  };
}

function storeTupleJettonMaster$Data(source: JettonMaster$Data) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.total_supply);
  builder.writeAddress(source.owner);
  builder.writeCell(source.content);
  builder.writeBoolean(source.mintable);
  builder.writeBoolean(source.publicUnlock);
  return builder.build();
}

function dictValueParserJettonMaster$Data(): DictionaryValue<JettonMaster$Data> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeJettonMaster$Data(src)).endCell());
    },
    parse: (src) => {
      return loadJettonMaster$Data(src.loadRef().beginParse());
    },
  };
}

export type JettonData = {
  $$type: 'JettonData';
  total_supply: bigint;
  mintable: boolean;
  owner: Address;
  content: Cell;
  wallet_code: Cell;
};

export function storeJettonData(src: JettonData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeInt(src.total_supply, 257);
    b_0.storeBit(src.mintable);
    b_0.storeAddress(src.owner);
    b_0.storeRef(src.content);
    b_0.storeRef(src.wallet_code);
  };
}

export function loadJettonData(slice: Slice) {
  let sc_0 = slice;
  let _total_supply = sc_0.loadIntBig(257);
  let _mintable = sc_0.loadBit();
  let _owner = sc_0.loadAddress();
  let _content = sc_0.loadRef();
  let _wallet_code = sc_0.loadRef();
  return {
    $$type: 'JettonData' as const,
    total_supply: _total_supply,
    mintable: _mintable,
    owner: _owner,
    content: _content,
    wallet_code: _wallet_code,
  };
}

function loadTupleJettonData(source: TupleReader) {
  let _total_supply = source.readBigNumber();
  let _mintable = source.readBoolean();
  let _owner = source.readAddress();
  let _content = source.readCell();
  let _wallet_code = source.readCell();
  return {
    $$type: 'JettonData' as const,
    total_supply: _total_supply,
    mintable: _mintable,
    owner: _owner,
    content: _content,
    wallet_code: _wallet_code,
  };
}

function loadGetterTupleJettonData(source: TupleReader) {
  let _total_supply = source.readBigNumber();
  let _mintable = source.readBoolean();
  let _owner = source.readAddress();
  let _content = source.readCell();
  let _wallet_code = source.readCell();
  return {
    $$type: 'JettonData' as const,
    total_supply: _total_supply,
    mintable: _mintable,
    owner: _owner,
    content: _content,
    wallet_code: _wallet_code,
  };
}

function storeTupleJettonData(source: JettonData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.total_supply);
  builder.writeBoolean(source.mintable);
  builder.writeAddress(source.owner);
  builder.writeCell(source.content);
  builder.writeCell(source.wallet_code);
  return builder.build();
}

function dictValueParserJettonData(): DictionaryValue<JettonData> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeJettonData(src)).endCell());
    },
    parse: (src) => {
      return loadJettonData(src.loadRef().beginParse());
    },
  };
}

export type JettonWalletData = {
  $$type: 'JettonWalletData';
  balance: bigint;
  owner: Address;
  master: Address;
  code: Cell;
};

export function storeJettonWalletData(src: JettonWalletData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeInt(src.balance, 257);
    b_0.storeAddress(src.owner);
    b_0.storeAddress(src.master);
    b_0.storeRef(src.code);
  };
}

export function loadJettonWalletData(slice: Slice) {
  let sc_0 = slice;
  let _balance = sc_0.loadIntBig(257);
  let _owner = sc_0.loadAddress();
  let _master = sc_0.loadAddress();
  let _code = sc_0.loadRef();
  return {
    $$type: 'JettonWalletData' as const,
    balance: _balance,
    owner: _owner,
    master: _master,
    code: _code,
  };
}

function loadTupleJettonWalletData(source: TupleReader) {
  let _balance = source.readBigNumber();
  let _owner = source.readAddress();
  let _master = source.readAddress();
  let _code = source.readCell();
  return {
    $$type: 'JettonWalletData' as const,
    balance: _balance,
    owner: _owner,
    master: _master,
    code: _code,
  };
}

function loadGetterTupleJettonWalletData(source: TupleReader) {
  let _balance = source.readBigNumber();
  let _owner = source.readAddress();
  let _master = source.readAddress();
  let _code = source.readCell();
  return {
    $$type: 'JettonWalletData' as const,
    balance: _balance,
    owner: _owner,
    master: _master,
    code: _code,
  };
}

function storeTupleJettonWalletData(source: JettonWalletData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.balance);
  builder.writeAddress(source.owner);
  builder.writeAddress(source.master);
  builder.writeCell(source.code);
  return builder.build();
}

function dictValueParserJettonWalletData(): DictionaryValue<JettonWalletData> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeJettonWalletData(src)).endCell());
    },
    parse: (src) => {
      return loadJettonWalletData(src.loadRef().beginParse());
    },
  };
}

export type TokenTransfer = {
  $$type: 'TokenTransfer';
  query_id: bigint;
  amount: bigint;
  sender: Address;
  response_destination: Address | null;
  custom_payload: Cell | null;
  forward_ton_amount: bigint;
  forward_payload: Slice;
};

export function storeTokenTransfer(src: TokenTransfer) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(260734629, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeCoins(src.amount);
    b_0.storeAddress(src.sender);
    b_0.storeAddress(src.response_destination);
    if (src.custom_payload !== null && src.custom_payload !== undefined) {
      b_0.storeBit(true).storeRef(src.custom_payload);
    } else {
      b_0.storeBit(false);
    }
    b_0.storeCoins(src.forward_ton_amount);
    b_0.storeBuilder(src.forward_payload.asBuilder());
  };
}

export function loadTokenTransfer(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 260734629) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _amount = sc_0.loadCoins();
  let _sender = sc_0.loadAddress();
  let _response_destination = sc_0.loadMaybeAddress();
  let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _forward_ton_amount = sc_0.loadCoins();
  let _forward_payload = sc_0;
  return {
    $$type: 'TokenTransfer' as const,
    query_id: _query_id,
    amount: _amount,
    sender: _sender,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
    forward_ton_amount: _forward_ton_amount,
    forward_payload: _forward_payload,
  };
}

function loadTupleTokenTransfer(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _sender = source.readAddress();
  let _response_destination = source.readAddressOpt();
  let _custom_payload = source.readCellOpt();
  let _forward_ton_amount = source.readBigNumber();
  let _forward_payload = source.readCell().asSlice();
  return {
    $$type: 'TokenTransfer' as const,
    query_id: _query_id,
    amount: _amount,
    sender: _sender,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
    forward_ton_amount: _forward_ton_amount,
    forward_payload: _forward_payload,
  };
}

function loadGetterTupleTokenTransfer(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _sender = source.readAddress();
  let _response_destination = source.readAddressOpt();
  let _custom_payload = source.readCellOpt();
  let _forward_ton_amount = source.readBigNumber();
  let _forward_payload = source.readCell().asSlice();
  return {
    $$type: 'TokenTransfer' as const,
    query_id: _query_id,
    amount: _amount,
    sender: _sender,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
    forward_ton_amount: _forward_ton_amount,
    forward_payload: _forward_payload,
  };
}

function storeTupleTokenTransfer(source: TokenTransfer) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.amount);
  builder.writeAddress(source.sender);
  builder.writeAddress(source.response_destination);
  builder.writeCell(source.custom_payload);
  builder.writeNumber(source.forward_ton_amount);
  builder.writeSlice(source.forward_payload.asCell());
  return builder.build();
}

function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
    },
    parse: (src) => {
      return loadTokenTransfer(src.loadRef().beginParse());
    },
  };
}

export type TokenTransferInternal = {
  $$type: 'TokenTransferInternal';
  query_id: bigint;
  amount: bigint;
  from: Address;
  response_destination: Address | null;
  forward_ton_amount: bigint;
  forward_payload: Slice;
};

export function storeTokenTransferInternal(src: TokenTransferInternal) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(395134233, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeCoins(src.amount);
    b_0.storeAddress(src.from);
    b_0.storeAddress(src.response_destination);
    b_0.storeCoins(src.forward_ton_amount);
    b_0.storeBuilder(src.forward_payload.asBuilder());
  };
}

export function loadTokenTransferInternal(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 395134233) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _amount = sc_0.loadCoins();
  let _from = sc_0.loadAddress();
  let _response_destination = sc_0.loadMaybeAddress();
  let _forward_ton_amount = sc_0.loadCoins();
  let _forward_payload = sc_0;
  return {
    $$type: 'TokenTransferInternal' as const,
    query_id: _query_id,
    amount: _amount,
    from: _from,
    response_destination: _response_destination,
    forward_ton_amount: _forward_ton_amount,
    forward_payload: _forward_payload,
  };
}

function loadTupleTokenTransferInternal(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _from = source.readAddress();
  let _response_destination = source.readAddressOpt();
  let _forward_ton_amount = source.readBigNumber();
  let _forward_payload = source.readCell().asSlice();
  return {
    $$type: 'TokenTransferInternal' as const,
    query_id: _query_id,
    amount: _amount,
    from: _from,
    response_destination: _response_destination,
    forward_ton_amount: _forward_ton_amount,
    forward_payload: _forward_payload,
  };
}

function loadGetterTupleTokenTransferInternal(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _from = source.readAddress();
  let _response_destination = source.readAddressOpt();
  let _forward_ton_amount = source.readBigNumber();
  let _forward_payload = source.readCell().asSlice();
  return {
    $$type: 'TokenTransferInternal' as const,
    query_id: _query_id,
    amount: _amount,
    from: _from,
    response_destination: _response_destination,
    forward_ton_amount: _forward_ton_amount,
    forward_payload: _forward_payload,
  };
}

function storeTupleTokenTransferInternal(source: TokenTransferInternal) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.amount);
  builder.writeAddress(source.from);
  builder.writeAddress(source.response_destination);
  builder.writeNumber(source.forward_ton_amount);
  builder.writeSlice(source.forward_payload.asCell());
  return builder.build();
}

function dictValueParserTokenTransferInternal(): DictionaryValue<TokenTransferInternal> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeTokenTransferInternal(src)).endCell());
    },
    parse: (src) => {
      return loadTokenTransferInternal(src.loadRef().beginParse());
    },
  };
}

export type TokenNotification = {
  $$type: 'TokenNotification';
  query_id: bigint;
  amount: bigint;
  from: Address;
  forward_payload: Slice;
};

export function storeTokenNotification(src: TokenNotification) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1935855772, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeCoins(src.amount);
    b_0.storeAddress(src.from);
    b_0.storeBuilder(src.forward_payload.asBuilder());
  };
}

export function loadTokenNotification(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1935855772) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _amount = sc_0.loadCoins();
  let _from = sc_0.loadAddress();
  let _forward_payload = sc_0;
  return {
    $$type: 'TokenNotification' as const,
    query_id: _query_id,
    amount: _amount,
    from: _from,
    forward_payload: _forward_payload,
  };
}

function loadTupleTokenNotification(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _from = source.readAddress();
  let _forward_payload = source.readCell().asSlice();
  return {
    $$type: 'TokenNotification' as const,
    query_id: _query_id,
    amount: _amount,
    from: _from,
    forward_payload: _forward_payload,
  };
}

function loadGetterTupleTokenNotification(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _from = source.readAddress();
  let _forward_payload = source.readCell().asSlice();
  return {
    $$type: 'TokenNotification' as const,
    query_id: _query_id,
    amount: _amount,
    from: _from,
    forward_payload: _forward_payload,
  };
}

function storeTupleTokenNotification(source: TokenNotification) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.amount);
  builder.writeAddress(source.from);
  builder.writeSlice(source.forward_payload.asCell());
  return builder.build();
}

function dictValueParserTokenNotification(): DictionaryValue<TokenNotification> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeTokenNotification(src)).endCell());
    },
    parse: (src) => {
      return loadTokenNotification(src.loadRef().beginParse());
    },
  };
}

export type TokenBurn = {
  $$type: 'TokenBurn';
  query_id: bigint;
  amount: bigint;
  response_destination: Address | null;
  custom_payload: Cell | null;
};

export function storeTokenBurn(src: TokenBurn) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1499400124, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeCoins(src.amount);
    b_0.storeAddress(src.response_destination);
    if (src.custom_payload !== null && src.custom_payload !== undefined) {
      b_0.storeBit(true).storeRef(src.custom_payload);
    } else {
      b_0.storeBit(false);
    }
  };
}

export function loadTokenBurn(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1499400124) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _amount = sc_0.loadCoins();
  let _response_destination = sc_0.loadMaybeAddress();
  let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
  return {
    $$type: 'TokenBurn' as const,
    query_id: _query_id,
    amount: _amount,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
  };
}

function loadTupleTokenBurn(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _response_destination = source.readAddressOpt();
  let _custom_payload = source.readCellOpt();
  return {
    $$type: 'TokenBurn' as const,
    query_id: _query_id,
    amount: _amount,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
  };
}

function loadGetterTupleTokenBurn(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _response_destination = source.readAddressOpt();
  let _custom_payload = source.readCellOpt();
  return {
    $$type: 'TokenBurn' as const,
    query_id: _query_id,
    amount: _amount,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
  };
}

function storeTupleTokenBurn(source: TokenBurn) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.amount);
  builder.writeAddress(source.response_destination);
  builder.writeCell(source.custom_payload);
  return builder.build();
}

function dictValueParserTokenBurn(): DictionaryValue<TokenBurn> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeTokenBurn(src)).endCell());
    },
    parse: (src) => {
      return loadTokenBurn(src.loadRef().beginParse());
    },
  };
}

export type TokenBurnNotification = {
  $$type: 'TokenBurnNotification';
  query_id: bigint;
  amount: bigint;
  sender: Address;
  response_destination: Address | null;
};

export function storeTokenBurnNotification(src: TokenBurnNotification) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2078119902, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeCoins(src.amount);
    b_0.storeAddress(src.sender);
    b_0.storeAddress(src.response_destination);
  };
}

export function loadTokenBurnNotification(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2078119902) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _amount = sc_0.loadCoins();
  let _sender = sc_0.loadAddress();
  let _response_destination = sc_0.loadMaybeAddress();
  return {
    $$type: 'TokenBurnNotification' as const,
    query_id: _query_id,
    amount: _amount,
    sender: _sender,
    response_destination: _response_destination,
  };
}

function loadTupleTokenBurnNotification(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _sender = source.readAddress();
  let _response_destination = source.readAddressOpt();
  return {
    $$type: 'TokenBurnNotification' as const,
    query_id: _query_id,
    amount: _amount,
    sender: _sender,
    response_destination: _response_destination,
  };
}

function loadGetterTupleTokenBurnNotification(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _amount = source.readBigNumber();
  let _sender = source.readAddress();
  let _response_destination = source.readAddressOpt();
  return {
    $$type: 'TokenBurnNotification' as const,
    query_id: _query_id,
    amount: _amount,
    sender: _sender,
    response_destination: _response_destination,
  };
}

function storeTupleTokenBurnNotification(source: TokenBurnNotification) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.amount);
  builder.writeAddress(source.sender);
  builder.writeAddress(source.response_destination);
  return builder.build();
}

function dictValueParserTokenBurnNotification(): DictionaryValue<TokenBurnNotification> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeTokenBurnNotification(src)).endCell());
    },
    parse: (src) => {
      return loadTokenBurnNotification(src.loadRef().beginParse());
    },
  };
}

export type TokenExcesses = {
  $$type: 'TokenExcesses';
  query_id: bigint;
};

export function storeTokenExcesses(src: TokenExcesses) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3576854235, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadTokenExcesses(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3576854235) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: 'TokenExcesses' as const, query_id: _query_id };
}

function loadTupleTokenExcesses(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: 'TokenExcesses' as const, query_id: _query_id };
}

function loadGetterTupleTokenExcesses(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: 'TokenExcesses' as const, query_id: _query_id };
}

function storeTupleTokenExcesses(source: TokenExcesses) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserTokenExcesses(): DictionaryValue<TokenExcesses> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeTokenExcesses(src)).endCell());
    },
    parse: (src) => {
      return loadTokenExcesses(src.loadRef().beginParse());
    },
  };
}

export type TokenUpdateContent = {
  $$type: 'TokenUpdateContent';
  content: Cell;
};

export function storeTokenUpdateContent(src: TokenUpdateContent) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2937889386, 32);
    b_0.storeRef(src.content);
  };
}

export function loadTokenUpdateContent(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2937889386) {
    throw Error('Invalid prefix');
  }
  let _content = sc_0.loadRef();
  return { $$type: 'TokenUpdateContent' as const, content: _content };
}

function loadTupleTokenUpdateContent(source: TupleReader) {
  let _content = source.readCell();
  return { $$type: 'TokenUpdateContent' as const, content: _content };
}

function loadGetterTupleTokenUpdateContent(source: TupleReader) {
  let _content = source.readCell();
  return { $$type: 'TokenUpdateContent' as const, content: _content };
}

function storeTupleTokenUpdateContent(source: TokenUpdateContent) {
  let builder = new TupleBuilder();
  builder.writeCell(source.content);
  return builder.build();
}

function dictValueParserTokenUpdateContent(): DictionaryValue<TokenUpdateContent> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeTokenUpdateContent(src)).endCell());
    },
    parse: (src) => {
      return loadTokenUpdateContent(src.loadRef().beginParse());
    },
  };
}

export type ProvideWalletAddress = {
  $$type: 'ProvideWalletAddress';
  query_id: bigint;
  owner_address: Address;
  include_address: boolean;
};

export function storeProvideWalletAddress(src: ProvideWalletAddress) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(745978227, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.owner_address);
    b_0.storeBit(src.include_address);
  };
}

export function loadProvideWalletAddress(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 745978227) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _owner_address = sc_0.loadAddress();
  let _include_address = sc_0.loadBit();
  return {
    $$type: 'ProvideWalletAddress' as const,
    query_id: _query_id,
    owner_address: _owner_address,
    include_address: _include_address,
  };
}

function loadTupleProvideWalletAddress(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _owner_address = source.readAddress();
  let _include_address = source.readBoolean();
  return {
    $$type: 'ProvideWalletAddress' as const,
    query_id: _query_id,
    owner_address: _owner_address,
    include_address: _include_address,
  };
}

function loadGetterTupleProvideWalletAddress(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _owner_address = source.readAddress();
  let _include_address = source.readBoolean();
  return {
    $$type: 'ProvideWalletAddress' as const,
    query_id: _query_id,
    owner_address: _owner_address,
    include_address: _include_address,
  };
}

function storeTupleProvideWalletAddress(source: ProvideWalletAddress) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.owner_address);
  builder.writeBoolean(source.include_address);
  return builder.build();
}

function dictValueParserProvideWalletAddress(): DictionaryValue<ProvideWalletAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeProvideWalletAddress(src)).endCell());
    },
    parse: (src) => {
      return loadProvideWalletAddress(src.loadRef().beginParse());
    },
  };
}

export type TakeWalletAddress = {
  $$type: 'TakeWalletAddress';
  query_id: bigint;
  wallet_address: Address;
  owner_address: Slice;
};

export function storeTakeWalletAddress(src: TakeWalletAddress) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3513996288, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.wallet_address);
    b_0.storeBuilder(src.owner_address.asBuilder());
  };
}

export function loadTakeWalletAddress(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3513996288) {
    throw Error('Invalid prefix');
  }
  let _query_id = sc_0.loadUintBig(64);
  let _wallet_address = sc_0.loadAddress();
  let _owner_address = sc_0;
  return {
    $$type: 'TakeWalletAddress' as const,
    query_id: _query_id,
    wallet_address: _wallet_address,
    owner_address: _owner_address,
  };
}

function loadTupleTakeWalletAddress(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _wallet_address = source.readAddress();
  let _owner_address = source.readCell().asSlice();
  return {
    $$type: 'TakeWalletAddress' as const,
    query_id: _query_id,
    wallet_address: _wallet_address,
    owner_address: _owner_address,
  };
}

function loadGetterTupleTakeWalletAddress(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _wallet_address = source.readAddress();
  let _owner_address = source.readCell().asSlice();
  return {
    $$type: 'TakeWalletAddress' as const,
    query_id: _query_id,
    wallet_address: _wallet_address,
    owner_address: _owner_address,
  };
}

function storeTupleTakeWalletAddress(source: TakeWalletAddress) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.wallet_address);
  builder.writeSlice(source.owner_address.asCell());
  return builder.build();
}

function dictValueParserTakeWalletAddress(): DictionaryValue<TakeWalletAddress> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeTakeWalletAddress(src)).endCell());
    },
    parse: (src) => {
      return loadTakeWalletAddress(src.loadRef().beginParse());
    },
  };
}

export type PlanInfo = {
  $$type: 'PlanInfo';
  price_per_token: bigint;
  tokens_amount: bigint;
  min_amount: bigint;
};

export function storePlanInfo(src: PlanInfo) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeCoins(src.price_per_token);
    b_0.storeCoins(src.tokens_amount);
    b_0.storeCoins(src.min_amount);
  };
}

export function loadPlanInfo(slice: Slice) {
  let sc_0 = slice;
  let _price_per_token = sc_0.loadCoins();
  let _tokens_amount = sc_0.loadCoins();
  let _min_amount = sc_0.loadCoins();
  return {
    $$type: 'PlanInfo' as const,
    price_per_token: _price_per_token,
    tokens_amount: _tokens_amount,
    min_amount: _min_amount,
  };
}

function loadTuplePlanInfo(source: TupleReader) {
  let _price_per_token = source.readBigNumber();
  let _tokens_amount = source.readBigNumber();
  let _min_amount = source.readBigNumber();
  return {
    $$type: 'PlanInfo' as const,
    price_per_token: _price_per_token,
    tokens_amount: _tokens_amount,
    min_amount: _min_amount,
  };
}

function loadGetterTuplePlanInfo(source: TupleReader) {
  let _price_per_token = source.readBigNumber();
  let _tokens_amount = source.readBigNumber();
  let _min_amount = source.readBigNumber();
  return {
    $$type: 'PlanInfo' as const,
    price_per_token: _price_per_token,
    tokens_amount: _tokens_amount,
    min_amount: _min_amount,
  };
}

function storeTuplePlanInfo(source: PlanInfo) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.price_per_token);
  builder.writeNumber(source.tokens_amount);
  builder.writeNumber(source.min_amount);
  return builder.build();
}

function dictValueParserPlanInfo(): DictionaryValue<PlanInfo> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storePlanInfo(src)).endCell());
    },
    parse: (src) => {
      return loadPlanInfo(src.loadRef().beginParse());
    },
  };
}

export type SetPlan = {
  $$type: 'SetPlan';
  plan_seqno: bigint;
  new_plan: PlanInfo;
};

export function storeSetPlan(src: SetPlan) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(4091319390, 32);
    b_0.storeUint(src.plan_seqno, 8);
    b_0.store(storePlanInfo(src.new_plan));
  };
}

export function loadSetPlan(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 4091319390) {
    throw Error('Invalid prefix');
  }
  let _plan_seqno = sc_0.loadUintBig(8);
  let _new_plan = loadPlanInfo(sc_0);
  return { $$type: 'SetPlan' as const, plan_seqno: _plan_seqno, new_plan: _new_plan };
}

function loadTupleSetPlan(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  const _new_plan = loadTuplePlanInfo(source);
  return { $$type: 'SetPlan' as const, plan_seqno: _plan_seqno, new_plan: _new_plan };
}

function loadGetterTupleSetPlan(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  const _new_plan = loadGetterTuplePlanInfo(source);
  return { $$type: 'SetPlan' as const, plan_seqno: _plan_seqno, new_plan: _new_plan };
}

function storeTupleSetPlan(source: SetPlan) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.plan_seqno);
  builder.writeTuple(storeTuplePlanInfo(source.new_plan));
  return builder.build();
}

function dictValueParserSetPlan(): DictionaryValue<SetPlan> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeSetPlan(src)).endCell());
    },
    parse: (src) => {
      return loadSetPlan(src.loadRef().beginParse());
    },
  };
}

export type RemovePlan = {
  $$type: 'RemovePlan';
  plan_seqno: bigint;
};

export function storeRemovePlan(src: RemovePlan) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1826455974, 32);
    b_0.storeUint(src.plan_seqno, 8);
  };
}

export function loadRemovePlan(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1826455974) {
    throw Error('Invalid prefix');
  }
  let _plan_seqno = sc_0.loadUintBig(8);
  return { $$type: 'RemovePlan' as const, plan_seqno: _plan_seqno };
}

function loadTupleRemovePlan(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  return { $$type: 'RemovePlan' as const, plan_seqno: _plan_seqno };
}

function loadGetterTupleRemovePlan(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  return { $$type: 'RemovePlan' as const, plan_seqno: _plan_seqno };
}

function storeTupleRemovePlan(source: RemovePlan) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.plan_seqno);
  return builder.build();
}

function dictValueParserRemovePlan(): DictionaryValue<RemovePlan> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeRemovePlan(src)).endCell());
    },
    parse: (src) => {
      return loadRemovePlan(src.loadRef().beginParse());
    },
  };
}

export type TopUpPlan = {
  $$type: 'TopUpPlan';
  plan_seqno: bigint;
};

export function storeTopUpPlan(src: TopUpPlan) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(src.plan_seqno, 8);
  };
}

export function loadTopUpPlan(slice: Slice) {
  let sc_0 = slice;
  let _plan_seqno = sc_0.loadUintBig(8);
  return { $$type: 'TopUpPlan' as const, plan_seqno: _plan_seqno };
}

function loadTupleTopUpPlan(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  return { $$type: 'TopUpPlan' as const, plan_seqno: _plan_seqno };
}

function loadGetterTupleTopUpPlan(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  return { $$type: 'TopUpPlan' as const, plan_seqno: _plan_seqno };
}

function storeTupleTopUpPlan(source: TopUpPlan) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.plan_seqno);
  return builder.build();
}

function dictValueParserTopUpPlan(): DictionaryValue<TopUpPlan> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeTopUpPlan(src)).endCell());
    },
    parse: (src) => {
      return loadTopUpPlan(src.loadRef().beginParse());
    },
  };
}

export type WithdrawFromPlan = {
  $$type: 'WithdrawFromPlan';
  plan_seqno: bigint;
  amount: bigint;
};

export function storeWithdrawFromPlan(src: WithdrawFromPlan) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1990978068, 32);
    b_0.storeUint(src.plan_seqno, 8);
    b_0.storeCoins(src.amount);
  };
}

export function loadWithdrawFromPlan(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1990978068) {
    throw Error('Invalid prefix');
  }
  let _plan_seqno = sc_0.loadUintBig(8);
  let _amount = sc_0.loadCoins();
  return { $$type: 'WithdrawFromPlan' as const, plan_seqno: _plan_seqno, amount: _amount };
}

function loadTupleWithdrawFromPlan(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  let _amount = source.readBigNumber();
  return { $$type: 'WithdrawFromPlan' as const, plan_seqno: _plan_seqno, amount: _amount };
}

function loadGetterTupleWithdrawFromPlan(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  let _amount = source.readBigNumber();
  return { $$type: 'WithdrawFromPlan' as const, plan_seqno: _plan_seqno, amount: _amount };
}

function storeTupleWithdrawFromPlan(source: WithdrawFromPlan) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.plan_seqno);
  builder.writeNumber(source.amount);
  return builder.build();
}

function dictValueParserWithdrawFromPlan(): DictionaryValue<WithdrawFromPlan> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeWithdrawFromPlan(src)).endCell());
    },
    parse: (src) => {
      return loadWithdrawFromPlan(src.loadRef().beginParse());
    },
  };
}

export type BuyTokens = {
  $$type: 'BuyTokens';
  plan_seqno: bigint;
  receiver: Address;
};

export function storeBuyTokens(src: BuyTokens) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(src.plan_seqno, 8);
    b_0.storeAddress(src.receiver);
  };
}

export function loadBuyTokens(slice: Slice) {
  let sc_0 = slice;
  let _plan_seqno = sc_0.loadUintBig(8);
  let _receiver = sc_0.loadAddress();
  return { $$type: 'BuyTokens' as const, plan_seqno: _plan_seqno, receiver: _receiver };
}

function loadTupleBuyTokens(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  let _receiver = source.readAddress();
  return { $$type: 'BuyTokens' as const, plan_seqno: _plan_seqno, receiver: _receiver };
}

function loadGetterTupleBuyTokens(source: TupleReader) {
  let _plan_seqno = source.readBigNumber();
  let _receiver = source.readAddress();
  return { $$type: 'BuyTokens' as const, plan_seqno: _plan_seqno, receiver: _receiver };
}

function storeTupleBuyTokens(source: BuyTokens) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.plan_seqno);
  builder.writeAddress(source.receiver);
  return builder.build();
}

function dictValueParserBuyTokens(): DictionaryValue<BuyTokens> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeBuyTokens(src)).endCell());
    },
    parse: (src) => {
      return loadBuyTokens(src.loadRef().beginParse());
    },
  };
}

export type Stop = {
  $$type: 'Stop';
};

export function storeStop(src: Stop) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(4227166658, 32);
  };
}

export function loadStop(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 4227166658) {
    throw Error('Invalid prefix');
  }
  return { $$type: 'Stop' as const };
}

function loadTupleStop(source: TupleReader) {
  return { $$type: 'Stop' as const };
}

function loadGetterTupleStop(source: TupleReader) {
  return { $$type: 'Stop' as const };
}

function storeTupleStop(source: Stop) {
  let builder = new TupleBuilder();
  return builder.build();
}

function dictValueParserStop(): DictionaryValue<Stop> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeStop(src)).endCell());
    },
    parse: (src) => {
      return loadStop(src.loadRef().beginParse());
    },
  };
}

export type Start = {
  $$type: 'Start';
};

export function storeStart(src: Start) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2718406916, 32);
  };
}

export function loadStart(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2718406916) {
    throw Error('Invalid prefix');
  }
  return { $$type: 'Start' as const };
}

function loadTupleStart(source: TupleReader) {
  return { $$type: 'Start' as const };
}

function loadGetterTupleStart(source: TupleReader) {
  return { $$type: 'Start' as const };
}

function storeTupleStart(source: Start) {
  let builder = new TupleBuilder();
  return builder.build();
}

function dictValueParserStart(): DictionaryValue<Start> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeStart(src)).endCell());
    },
    parse: (src) => {
      return loadStart(src.loadRef().beginParse());
    },
  };
}

export type DrainAll = {
  $$type: 'DrainAll';
};

export function storeDrainAll(src: DrainAll) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1051056026, 32);
  };
}

export function loadDrainAll(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1051056026) {
    throw Error('Invalid prefix');
  }
  return { $$type: 'DrainAll' as const };
}

function loadTupleDrainAll(source: TupleReader) {
  return { $$type: 'DrainAll' as const };
}

function loadGetterTupleDrainAll(source: TupleReader) {
  return { $$type: 'DrainAll' as const };
}

function storeTupleDrainAll(source: DrainAll) {
  let builder = new TupleBuilder();
  return builder.build();
}

function dictValueParserDrainAll(): DictionaryValue<DrainAll> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeDrainAll(src)).endCell());
    },
    parse: (src) => {
      return loadDrainAll(src.loadRef().beginParse());
    },
  };
}

export type WithdrawUsdt = {
  $$type: 'WithdrawUsdt';
  amount: bigint;
};

export function storeWithdrawUsdt(src: WithdrawUsdt) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2882846, 32);
    b_0.storeCoins(src.amount);
  };
}

export function loadWithdrawUsdt(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2882846) {
    throw Error('Invalid prefix');
  }
  let _amount = sc_0.loadCoins();
  return { $$type: 'WithdrawUsdt' as const, amount: _amount };
}

function loadTupleWithdrawUsdt(source: TupleReader) {
  let _amount = source.readBigNumber();
  return { $$type: 'WithdrawUsdt' as const, amount: _amount };
}

function loadGetterTupleWithdrawUsdt(source: TupleReader) {
  let _amount = source.readBigNumber();
  return { $$type: 'WithdrawUsdt' as const, amount: _amount };
}

function storeTupleWithdrawUsdt(source: WithdrawUsdt) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.amount);
  return builder.build();
}

function dictValueParserWithdrawUsdt(): DictionaryValue<WithdrawUsdt> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeWithdrawUsdt(src)).endCell());
    },
    parse: (src) => {
      return loadWithdrawUsdt(src.loadRef().beginParse());
    },
  };
}

export type WithdrawTokensForce = {
  $$type: 'WithdrawTokensForce';
  amount: bigint;
};

export function storeWithdrawTokensForce(src: WithdrawTokensForce) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(581355449, 32);
    b_0.storeCoins(src.amount);
  };
}

export function loadWithdrawTokensForce(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 581355449) {
    throw Error('Invalid prefix');
  }
  let _amount = sc_0.loadCoins();
  return { $$type: 'WithdrawTokensForce' as const, amount: _amount };
}

function loadTupleWithdrawTokensForce(source: TupleReader) {
  let _amount = source.readBigNumber();
  return { $$type: 'WithdrawTokensForce' as const, amount: _amount };
}

function loadGetterTupleWithdrawTokensForce(source: TupleReader) {
  let _amount = source.readBigNumber();
  return { $$type: 'WithdrawTokensForce' as const, amount: _amount };
}

function storeTupleWithdrawTokensForce(source: WithdrawTokensForce) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.amount);
  return builder.build();
}

function dictValueParserWithdrawTokensForce(): DictionaryValue<WithdrawTokensForce> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeWithdrawTokensForce(src)).endCell());
    },
    parse: (src) => {
      return loadWithdrawTokensForce(src.loadRef().beginParse());
    },
  };
}

export type Withdraw = {
  $$type: 'Withdraw';
  amount: bigint;
};

export function storeWithdraw(src: Withdraw) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(195467089, 32);
    b_0.storeCoins(src.amount);
  };
}

export function loadWithdraw(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 195467089) {
    throw Error('Invalid prefix');
  }
  let _amount = sc_0.loadCoins();
  return { $$type: 'Withdraw' as const, amount: _amount };
}

function loadTupleWithdraw(source: TupleReader) {
  let _amount = source.readBigNumber();
  return { $$type: 'Withdraw' as const, amount: _amount };
}

function loadGetterTupleWithdraw(source: TupleReader) {
  let _amount = source.readBigNumber();
  return { $$type: 'Withdraw' as const, amount: _amount };
}

function storeTupleWithdraw(source: Withdraw) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.amount);
  return builder.build();
}

function dictValueParserWithdraw(): DictionaryValue<Withdraw> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storeWithdraw(src)).endCell());
    },
    parse: (src) => {
      return loadWithdraw(src.loadRef().beginParse());
    },
  };
}

export type PublickUnlockState = {
  $$type: 'PublickUnlockState';
  newState: boolean;
};

export function storePublickUnlockState(src: PublickUnlockState) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2953017186, 32);
    b_0.storeBit(src.newState);
  };
}

export function loadPublickUnlockState(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2953017186) {
    throw Error('Invalid prefix');
  }
  let _newState = sc_0.loadBit();
  return { $$type: 'PublickUnlockState' as const, newState: _newState };
}

function loadTuplePublickUnlockState(source: TupleReader) {
  let _newState = source.readBoolean();
  return { $$type: 'PublickUnlockState' as const, newState: _newState };
}

function loadGetterTuplePublickUnlockState(source: TupleReader) {
  let _newState = source.readBoolean();
  return { $$type: 'PublickUnlockState' as const, newState: _newState };
}

function storeTuplePublickUnlockState(source: PublickUnlockState) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.newState);
  return builder.build();
}

function dictValueParserPublickUnlockState(): DictionaryValue<PublickUnlockState> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storePublickUnlockState(src)).endCell());
    },
    parse: (src) => {
      return loadPublickUnlockState(src.loadRef().beginParse());
    },
  };
}

export type PresaleMaster$Data = {
  $$type: 'PresaleMaster$Data';
  owner: Address;
  stopped: boolean;
  my_jetton_wallet: Address;
  my_usdt_wallet: Address;
  plans: Dictionary<number, PlanInfo>;
};

export function storePresaleMaster$Data(src: PresaleMaster$Data) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeAddress(src.owner);
    b_0.storeBit(src.stopped);
    b_0.storeAddress(src.my_jetton_wallet);
    b_0.storeAddress(src.my_usdt_wallet);
    b_0.storeDict(src.plans, Dictionary.Keys.Uint(8), dictValueParserPlanInfo());
  };
}

export function loadPresaleMaster$Data(slice: Slice) {
  let sc_0 = slice;
  let _owner = sc_0.loadAddress();
  let _stopped = sc_0.loadBit();
  let _my_jetton_wallet = sc_0.loadAddress();
  let _my_usdt_wallet = sc_0.loadAddress();
  let _plans = Dictionary.load(Dictionary.Keys.Uint(8), dictValueParserPlanInfo(), sc_0);
  return {
    $$type: 'PresaleMaster$Data' as const,
    owner: _owner,
    stopped: _stopped,
    my_jetton_wallet: _my_jetton_wallet,
    my_usdt_wallet: _my_usdt_wallet,
    plans: _plans,
  };
}

function loadTuplePresaleMaster$Data(source: TupleReader) {
  let _owner = source.readAddress();
  let _stopped = source.readBoolean();
  let _my_jetton_wallet = source.readAddress();
  let _my_usdt_wallet = source.readAddress();
  let _plans = Dictionary.loadDirect(
    Dictionary.Keys.Uint(8),
    dictValueParserPlanInfo(),
    source.readCellOpt()
  );
  return {
    $$type: 'PresaleMaster$Data' as const,
    owner: _owner,
    stopped: _stopped,
    my_jetton_wallet: _my_jetton_wallet,
    my_usdt_wallet: _my_usdt_wallet,
    plans: _plans,
  };
}

function loadGetterTuplePresaleMaster$Data(source: TupleReader) {
  let _owner = source.readAddress();
  let _stopped = source.readBoolean();
  let _my_jetton_wallet = source.readAddress();
  let _my_usdt_wallet = source.readAddress();
  let _plans = Dictionary.loadDirect(
    Dictionary.Keys.Uint(8),
    dictValueParserPlanInfo(),
    source.readCellOpt()
  );
  return {
    $$type: 'PresaleMaster$Data' as const,
    owner: _owner,
    stopped: _stopped,
    my_jetton_wallet: _my_jetton_wallet,
    my_usdt_wallet: _my_usdt_wallet,
    plans: _plans,
  };
}

function storeTuplePresaleMaster$Data(source: PresaleMaster$Data) {
  let builder = new TupleBuilder();
  builder.writeAddress(source.owner);
  builder.writeBoolean(source.stopped);
  builder.writeAddress(source.my_jetton_wallet);
  builder.writeAddress(source.my_usdt_wallet);
  builder.writeCell(
    source.plans.size > 0
      ? beginCell()
          .storeDictDirect(source.plans, Dictionary.Keys.Uint(8), dictValueParserPlanInfo())
          .endCell()
      : null
  );
  return builder.build();
}

function dictValueParserPresaleMaster$Data(): DictionaryValue<PresaleMaster$Data> {
  return {
    serialize: (src, builder) => {
      builder.storeRef(beginCell().store(storePresaleMaster$Data(src)).endCell());
    },
    parse: (src) => {
      return loadPresaleMaster$Data(src.loadRef().beginParse());
    },
  };
}

type JettonMaster_init_args = {
  $$type: 'JettonMaster_init_args';
  owner: Address;
  content: Cell;
};

function initJettonMaster_init_args(src: JettonMaster_init_args) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeAddress(src.owner);
    b_0.storeRef(src.content);
  };
}

async function JettonMaster_init(owner: Address, content: Cell) {
  const __code = Cell.fromBase64(
    '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'
  );
  const __system = Cell.fromBase64(
    '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'
  );
  let builder = beginCell();
  builder.storeRef(__system);
  builder.storeUint(0, 1);
  initJettonMaster_init_args({ $$type: 'JettonMaster_init_args', owner, content })(builder);
  const __data = builder.endCell();
  return { code: __code, data: __data };
}

const JettonMaster_errors: { [key: number]: { message: string } } = {
  2: { message: `Stack underflow` },
  3: { message: `Stack overflow` },
  4: { message: `Integer overflow` },
  5: { message: `Integer out of expected range` },
  6: { message: `Invalid opcode` },
  7: { message: `Type check error` },
  8: { message: `Cell overflow` },
  9: { message: `Cell underflow` },
  10: { message: `Dictionary error` },
  11: { message: `'Unknown' error` },
  12: { message: `Fatal error` },
  13: { message: `Out of gas error` },
  14: { message: `Virtualization error` },
  32: { message: `Action list is invalid` },
  33: { message: `Action list is too long` },
  34: { message: `Action is invalid or not supported` },
  35: { message: `Invalid source address in outbound message` },
  36: { message: `Invalid destination address in outbound message` },
  37: { message: `Not enough TON` },
  38: { message: `Not enough extra-currencies` },
  39: { message: `Outbound message does not fit into a cell after rewriting` },
  40: { message: `Cannot process a message` },
  41: { message: `Library reference is null` },
  42: { message: `Library change action error` },
  43: {
    message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree`,
  },
  50: { message: `Account state size exceeded limits` },
  128: { message: `Null reference exception` },
  129: { message: `Invalid serialization prefix` },
  130: { message: `Invalid incoming message` },
  131: { message: `Constraints error` },
  132: { message: `Access denied` },
  133: { message: `Contract stopped` },
  134: { message: `Invalid argument` },
  135: { message: `Code of a contract was not found` },
  136: { message: `Invalid address` },
  137: { message: `Masterchain support is not enabled for this contract` },
  3047: { message: `Unknown sender` },
  3688: { message: `Not mintable` },
  4429: { message: `Invalid sender` },
  7142: { message: `Incorrect USDT transfer forward payload` },
  14534: { message: `Not owner` },
  15509: { message: `Only deployer is allowed to withdraw` },
  18349: { message: `Sending is disabled` },
  18668: { message: `Can't Mint Anymore` },
  19392: { message: `Not owner's jettons` },
  21041: { message: `Only owner can topup jetton plan` },
  22499: { message: `Incorrect amount` },
  23951: { message: `Insufficient gas` },
  28373: { message: `Less than a minimum amount` },
  33445: { message: `Price per token must be greater than zero` },
  35025: { message: `Public unlock is disabled` },
  40368: { message: `Contract stopped` },
  42708: { message: `Invalid sender!` },
  43422: { message: `Invalid value - Burn` },
  46099: { message: `Plan has not enough jettons` },
  51768: { message: `Incorrect jetton transfer forward topup payload` },
  53296: { message: `Contract not stopped` },
  54332: { message: `Inculfficient tokens in plan` },
  54615: { message: `Insufficient balance` },
  57671: { message: `Unknown plan` },
  62972: { message: `Invalid balance` },
};

const JettonMaster_types: ABIType[] = [
  {
    name: 'StateInit',
    header: null,
    fields: [
      { name: 'code', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'data', type: { kind: 'simple', type: 'cell', optional: false } },
    ],
  },
  {
    name: 'StdAddress',
    header: null,
    fields: [
      { name: 'workchain', type: { kind: 'simple', type: 'int', optional: false, format: 8 } },
      { name: 'address', type: { kind: 'simple', type: 'uint', optional: false, format: 256 } },
    ],
  },
  {
    name: 'VarAddress',
    header: null,
    fields: [
      { name: 'workchain', type: { kind: 'simple', type: 'int', optional: false, format: 32 } },
      { name: 'address', type: { kind: 'simple', type: 'slice', optional: false } },
    ],
  },
  {
    name: 'Context',
    header: null,
    fields: [
      { name: 'bounced', type: { kind: 'simple', type: 'bool', optional: false } },
      { name: 'sender', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'value', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'raw', type: { kind: 'simple', type: 'slice', optional: false } },
    ],
  },
  {
    name: 'SendParameters',
    header: null,
    fields: [
      { name: 'bounce', type: { kind: 'simple', type: 'bool', optional: false } },
      { name: 'to', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'value', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'mode', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'body', type: { kind: 'simple', type: 'cell', optional: true } },
      { name: 'code', type: { kind: 'simple', type: 'cell', optional: true } },
      { name: 'data', type: { kind: 'simple', type: 'cell', optional: true } },
    ],
  },
  {
    name: 'Deploy',
    header: 2490013878,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
    ],
  },
  {
    name: 'DeployOk',
    header: 2952335191,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
    ],
  },
  {
    name: 'FactoryDeploy',
    header: 1829761339,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'cashback', type: { kind: 'simple', type: 'address', optional: false } },
    ],
  },
  {
    name: 'ChangeOwner',
    header: 2174598809,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'newOwner', type: { kind: 'simple', type: 'address', optional: false } },
    ],
  },
  {
    name: 'ChangeOwnerOk',
    header: 846932810,
    fields: [
      { name: 'queryId', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'newOwner', type: { kind: 'simple', type: 'address', optional: false } },
    ],
  },
  { name: 'UnlockMyWallet', header: 3955656361, fields: [] },
  { name: 'UnlockMe', header: 238808378, fields: [] },
  {
    name: 'ChangeWalletStatus',
    header: 3398027824,
    fields: [
      { name: 'wallet_owner', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'newStatus', type: { kind: 'simple', type: 'bool', optional: false } },
    ],
  },
  {
    name: 'WalletOrder',
    header: 954660261,
    fields: [{ name: 'newStatus', type: { kind: 'simple', type: 'bool', optional: false } }],
  },
  {
    name: 'Mint',
    header: 4235234258,
    fields: [
      { name: 'amount', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'receiver', type: { kind: 'simple', type: 'address', optional: false } },
    ],
  },
  { name: 'MintClose', header: 3040496651, fields: [] },
  {
    name: 'JettonWallet$Data',
    header: null,
    fields: [
      { name: 'balance', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
      { name: 'owner', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'master', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'sendingEnabled', type: { kind: 'simple', type: 'bool', optional: false } },
    ],
  },
  {
    name: 'JettonMaster$Data',
    header: null,
    fields: [
      {
        name: 'total_supply',
        type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' },
      },
      { name: 'owner', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'content', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'mintable', type: { kind: 'simple', type: 'bool', optional: false } },
      { name: 'publicUnlock', type: { kind: 'simple', type: 'bool', optional: false } },
    ],
  },
  {
    name: 'JettonData',
    header: null,
    fields: [
      { name: 'total_supply', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'mintable', type: { kind: 'simple', type: 'bool', optional: false } },
      { name: 'owner', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'content', type: { kind: 'simple', type: 'cell', optional: false } },
      { name: 'wallet_code', type: { kind: 'simple', type: 'cell', optional: false } },
    ],
  },
  {
    name: 'JettonWalletData',
    header: null,
    fields: [
      { name: 'balance', type: { kind: 'simple', type: 'int', optional: false, format: 257 } },
      { name: 'owner', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'master', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'code', type: { kind: 'simple', type: 'cell', optional: false } },
    ],
  },
  {
    name: 'TokenTransfer',
    header: 260734629,
    fields: [
      { name: 'query_id', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'amount', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
      { name: 'sender', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'response_destination', type: { kind: 'simple', type: 'address', optional: true } },
      { name: 'custom_payload', type: { kind: 'simple', type: 'cell', optional: true } },
      {
        name: 'forward_ton_amount',
        type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' },
      },
      {
        name: 'forward_payload',
        type: { kind: 'simple', type: 'slice', optional: false, format: 'remainder' },
      },
    ],
  },
  {
    name: 'TokenTransferInternal',
    header: 395134233,
    fields: [
      { name: 'query_id', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'amount', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
      { name: 'from', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'response_destination', type: { kind: 'simple', type: 'address', optional: true } },
      {
        name: 'forward_ton_amount',
        type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' },
      },
      {
        name: 'forward_payload',
        type: { kind: 'simple', type: 'slice', optional: false, format: 'remainder' },
      },
    ],
  },
  {
    name: 'TokenNotification',
    header: 1935855772,
    fields: [
      { name: 'query_id', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'amount', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
      { name: 'from', type: { kind: 'simple', type: 'address', optional: false } },
      {
        name: 'forward_payload',
        type: { kind: 'simple', type: 'slice', optional: false, format: 'remainder' },
      },
    ],
  },
  {
    name: 'TokenBurn',
    header: 1499400124,
    fields: [
      { name: 'query_id', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'amount', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
      { name: 'response_destination', type: { kind: 'simple', type: 'address', optional: true } },
      { name: 'custom_payload', type: { kind: 'simple', type: 'cell', optional: true } },
    ],
  },
  {
    name: 'TokenBurnNotification',
    header: 2078119902,
    fields: [
      { name: 'query_id', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'amount', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
      { name: 'sender', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'response_destination', type: { kind: 'simple', type: 'address', optional: true } },
    ],
  },
  {
    name: 'TokenExcesses',
    header: 3576854235,
    fields: [
      { name: 'query_id', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
    ],
  },
  {
    name: 'TokenUpdateContent',
    header: 2937889386,
    fields: [{ name: 'content', type: { kind: 'simple', type: 'cell', optional: false } }],
  },
  {
    name: 'ProvideWalletAddress',
    header: 745978227,
    fields: [
      { name: 'query_id', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'owner_address', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'include_address', type: { kind: 'simple', type: 'bool', optional: false } },
    ],
  },
  {
    name: 'TakeWalletAddress',
    header: 3513996288,
    fields: [
      { name: 'query_id', type: { kind: 'simple', type: 'uint', optional: false, format: 64 } },
      { name: 'wallet_address', type: { kind: 'simple', type: 'address', optional: false } },
      {
        name: 'owner_address',
        type: { kind: 'simple', type: 'slice', optional: false, format: 'remainder' },
      },
    ],
  },
  {
    name: 'PlanInfo',
    header: null,
    fields: [
      {
        name: 'price_per_token',
        type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' },
      },
      {
        name: 'tokens_amount',
        type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' },
      },
      {
        name: 'min_amount',
        type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' },
      },
    ],
  },
  {
    name: 'SetPlan',
    header: 4091319390,
    fields: [
      { name: 'plan_seqno', type: { kind: 'simple', type: 'uint', optional: false, format: 8 } },
      { name: 'new_plan', type: { kind: 'simple', type: 'PlanInfo', optional: false } },
    ],
  },
  {
    name: 'RemovePlan',
    header: 1826455974,
    fields: [
      { name: 'plan_seqno', type: { kind: 'simple', type: 'uint', optional: false, format: 8 } },
    ],
  },
  {
    name: 'TopUpPlan',
    header: null,
    fields: [
      { name: 'plan_seqno', type: { kind: 'simple', type: 'uint', optional: false, format: 8 } },
    ],
  },
  {
    name: 'WithdrawFromPlan',
    header: 1990978068,
    fields: [
      { name: 'plan_seqno', type: { kind: 'simple', type: 'uint', optional: false, format: 8 } },
      { name: 'amount', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
    ],
  },
  {
    name: 'BuyTokens',
    header: null,
    fields: [
      { name: 'plan_seqno', type: { kind: 'simple', type: 'uint', optional: false, format: 8 } },
      { name: 'receiver', type: { kind: 'simple', type: 'address', optional: false } },
    ],
  },
  { name: 'Stop', header: 4227166658, fields: [] },
  { name: 'Start', header: 2718406916, fields: [] },
  { name: 'DrainAll', header: 1051056026, fields: [] },
  {
    name: 'WithdrawUsdt',
    header: 2882846,
    fields: [
      { name: 'amount', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
    ],
  },
  {
    name: 'WithdrawTokensForce',
    header: 581355449,
    fields: [
      { name: 'amount', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
    ],
  },
  {
    name: 'Withdraw',
    header: 195467089,
    fields: [
      { name: 'amount', type: { kind: 'simple', type: 'uint', optional: false, format: 'coins' } },
    ],
  },
  {
    name: 'PublickUnlockState',
    header: 2953017186,
    fields: [{ name: 'newState', type: { kind: 'simple', type: 'bool', optional: false } }],
  },
  {
    name: 'PresaleMaster$Data',
    header: null,
    fields: [
      { name: 'owner', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'stopped', type: { kind: 'simple', type: 'bool', optional: false } },
      { name: 'my_jetton_wallet', type: { kind: 'simple', type: 'address', optional: false } },
      { name: 'my_usdt_wallet', type: { kind: 'simple', type: 'address', optional: false } },
      {
        name: 'plans',
        type: { kind: 'dict', key: 'uint', keyFormat: 8, value: 'PlanInfo', valueFormat: 'ref' },
      },
    ],
  },
];

const JettonMaster_getters: ABIGetter[] = [
  {
    name: 'get_public_unlock',
    arguments: [],
    returnType: { kind: 'simple', type: 'bool', optional: false },
  },
  {
    name: 'mintable',
    arguments: [],
    returnType: { kind: 'simple', type: 'bool', optional: false },
  },
  {
    name: 'get_jetton_data',
    arguments: [],
    returnType: { kind: 'simple', type: 'JettonData', optional: false },
  },
  {
    name: 'get_wallet_address',
    arguments: [{ name: 'owner', type: { kind: 'simple', type: 'address', optional: false } }],
    returnType: { kind: 'simple', type: 'address', optional: false },
  },
  {
    name: 'owner',
    arguments: [],
    returnType: { kind: 'simple', type: 'address', optional: false },
  },
];

export const JettonMaster_getterMapping: { [key: string]: string } = {
  get_public_unlock: 'getGetPublicUnlock',
  mintable: 'getMintable',
  get_jetton_data: 'getGetJettonData',
  get_wallet_address: 'getGetWalletAddress',
  owner: 'getOwner',
};

const JettonMaster_receivers: ABIReceiver[] = [
  { receiver: 'internal', message: { kind: 'typed', type: 'Mint' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'UnlockMyWallet' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'UnlockMe' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'ChangeWalletStatus' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'PublickUnlockState' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'MintClose' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'TokenUpdateContent' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'TokenBurnNotification' } },
  { receiver: 'internal', message: { kind: 'typed', type: 'ProvideWalletAddress' } },
];

export class JettonMaster implements Contract {
  static async init(owner: Address, content: Cell) {
    return await JettonMaster_init(owner, content);
  }

  static async fromInit(owner: Address, content: Cell) {
    const init = await JettonMaster_init(owner, content);
    const address = contractAddress(0, init);
    return new JettonMaster(address, init);
  }

  static fromAddress(address: Address) {
    return new JettonMaster(address);
  }

  readonly address: Address;
  readonly init?: { code: Cell; data: Cell };
  readonly abi: ContractABI = {
    types: JettonMaster_types,
    getters: JettonMaster_getters,
    receivers: JettonMaster_receivers,
    errors: JettonMaster_errors,
  };

  private constructor(address: Address, init?: { code: Cell; data: Cell }) {
    this.address = address;
    this.init = init;
  }

  async send(
    provider: ContractProvider,
    via: Sender,
    args: { value: bigint; bounce?: boolean | null | undefined },
    message:
      | Mint
      | UnlockMyWallet
      | UnlockMe
      | ChangeWalletStatus
      | PublickUnlockState
      | MintClose
      | TokenUpdateContent
      | TokenBurnNotification
      | ProvideWalletAddress
  ) {
    let body: Cell | null = null;
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'Mint'
    ) {
      body = beginCell().store(storeMint(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'UnlockMyWallet'
    ) {
      body = beginCell().store(storeUnlockMyWallet(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'UnlockMe'
    ) {
      body = beginCell().store(storeUnlockMe(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'ChangeWalletStatus'
    ) {
      body = beginCell().store(storeChangeWalletStatus(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'PublickUnlockState'
    ) {
      body = beginCell().store(storePublickUnlockState(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'MintClose'
    ) {
      body = beginCell().store(storeMintClose(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'TokenUpdateContent'
    ) {
      body = beginCell().store(storeTokenUpdateContent(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'TokenBurnNotification'
    ) {
      body = beginCell().store(storeTokenBurnNotification(message)).endCell();
    }
    if (
      message &&
      typeof message === 'object' &&
      !(message instanceof Slice) &&
      message.$$type === 'ProvideWalletAddress'
    ) {
      body = beginCell().store(storeProvideWalletAddress(message)).endCell();
    }
    if (body === null) {
      throw new Error('Invalid message type');
    }

    await provider.internal(via, { ...args, body: body });
  }

  async getGetPublicUnlock(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('get_public_unlock', builder.build())).stack;
    let result = source.readBoolean();
    return result;
  }

  async getMintable(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('mintable', builder.build())).stack;
    let result = source.readBoolean();
    return result;
  }

  async getGetJettonData(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('get_jetton_data', builder.build())).stack;
    const result = loadGetterTupleJettonData(source);
    return result;
  }

  async getGetWalletAddress(provider: ContractProvider, owner: Address) {
    let builder = new TupleBuilder();
    builder.writeAddress(owner);
    let source = (await provider.get('get_wallet_address', builder.build())).stack;
    let result = source.readAddress();
    return result;
  }

  async getOwner(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get('owner', builder.build())).stack;
    let result = source.readAddress();
    return result;
  }
}
