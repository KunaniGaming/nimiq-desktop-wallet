class Class{static register(e){"undefined"!=typeof exports&&(exports[e.name]=e)}}Class.register(Class);class PlatformUtils{static isBrowser(){return"undefined"!=typeof window}static isNodeJs(){return!PlatformUtils.isBrowser()&&"object"==typeof process&&"function"==typeof require}static supportsWebRTC(){return!!(PlatformUtils.isBrowser()?window.RTCPeerConnection||window.webkitRTCPeerConnection:null)}static isOnline(){return!PlatformUtils.isBrowser()||!("onLine"in window.navigator)||window.navigator.onLine}}Class.register(PlatformUtils);class LogNative{constructor(){this._global_level=Log.INFO,this._tag_levels={};try{if(window.localStorage)try{let e=window.localStorage.getItem("log_tag_levels");e&&"string"==typeof e&&(e=JSON.parse(e)),e&&"object"==typeof e&&(this._tag_levels=e)}catch(e){console.warn("Failed to load log configuration from local storage.")}}catch(e){}}isLoggable(e,t){return e&&this._tag_levels[e]?this._tag_levels[e]<=t:this._tag_levels["*"]?this._tag_levels["*"]<=t:this._global_level<=t}setLoggable(e,t){e&&e.name&&(e=e.name),this._tag_levels[e]=t,window.localStorage&&window.localStorage.setItem("log_tag_levels",JSON.stringify(this._tag_levels))}msg(e,t,r){t&&t.name&&(t=t.name),this.isLoggable(t,e)&&(t&&r.unshift(t+":"),r.unshift(`[${Log.Level.toStringTag(e)} ${(new Date).toTimeString().substr(0,8)}]`),console.error&&e>=Log.ERROR?console.error.apply(console,r):console.warn&&e>=Log.WARNING?console.warn.apply(console,r):console.info&&e>=Log.INFO?console.info.apply(console,r):console.debug&&e>=Log.DEBUG?console.debug.apply(console,r):console.trace&&e<=Log.TRACE?console.trace.apply(console,r):console.log.apply(console,r))}}Class.register(LogNative);class Log{static get instance(){return Log._instance||(Log._instance=new Log(new LogNative)),Log._instance}constructor(e){this._native=e}setLoggable(e,t){this._native.setLoggable(e,t)}get level(){return this._native._global_level}set level(e){this._native._global_level=e}msg(e,t,r){if(this._native.isLoggable(t,e)){for(let e=0;e<r.length;++e)"function"==typeof r[e]&&(r[e]=r[e]()),"object"==typeof r[e]&&("function"==typeof r[e].toString?r[e]=r[e].toString():r[e].constructor&&r[e].constructor.name?r[e]=`{Object: ${r[e].constructor.name}}`:r[e]="{Object}");this._native.msg(e,t,r)}}static d(e,t,...r){arguments.length>=2?(e=arguments[0],r=Array.prototype.slice.call(arguments,1)):(e=void 0,r=Array.prototype.slice.call(arguments,0)),Log.instance.msg(Log.DEBUG,e,r)}static e(e,t,...r){arguments.length>=2?(e=arguments[0],r=Array.prototype.slice.call(arguments,1)):(e=void 0,r=Array.prototype.slice.call(arguments,0)),Log.instance.msg(Log.ERROR,e,r)}static i(e,t,...r){arguments.length>=2?(e=arguments[0],r=Array.prototype.slice.call(arguments,1)):(e=void 0,r=Array.prototype.slice.call(arguments,0)),Log.instance.msg(Log.INFO,e,r)}static v(e,t,...r){arguments.length>=2?(e=arguments[0],r=Array.prototype.slice.call(arguments,1)):(e=void 0,r=Array.prototype.slice.call(arguments,0)),Log.instance.msg(Log.VERBOSE,e,r)}static w(e,t,...r){arguments.length>=2?(e=arguments[0],r=Array.prototype.slice.call(arguments,1)):(e=void 0,r=Array.prototype.slice.call(arguments,0)),Log.instance.msg(Log.WARNING,e,r)}static t(e,t,...r){arguments.length>=2?(e=arguments[0],r=Array.prototype.slice.call(arguments,1)):(e=void 0,r=Array.prototype.slice.call(arguments,0)),Log.instance.msg(Log.TRACE,e,r)}}Log.Level={TRACE:1,VERBOSE:2,DEBUG:3,INFO:4,WARNING:5,ERROR:6,ASSERT:7,toStringTag:function(e){switch(e){case Log.TRACE:return"T";case Log.VERBOSE:return"V";case Log.DEBUG:return"D";case Log.INFO:return"I";case Log.WARNING:return"W";case Log.ERROR:return"E";case Log.ASSERT:return"A";default:return"*"}}},Log.TRACE=Log.Level.TRACE,Log.VERBOSE=Log.Level.VERBOSE,Log.DEBUG=Log.Level.DEBUG,Log.INFO=Log.Level.INFO,Log.WARNING=Log.Level.WARNING,Log.ERROR=Log.Level.ERROR,Log.ASSERT=Log.Level.ASSERT,Log._instance=null,Log.d.tag=(e=>Log.d.bind(null,e)),Log.e.tag=(e=>Log.e.bind(null,e)),Log.i.tag=(e=>Log.i.bind(null,e)),Log.v.tag=(e=>Log.v.bind(null,e)),Log.w.tag=(e=>Log.w.bind(null,e)),Log.t.tag=(e=>Log.t.bind(null,e)),Class.register(Log);class IWorker{static async createProxy(e,t,r){return new(IWorker.Proxy(e))(r,t)}static async startWorkerForProxy(e,t,r){return"undefined"==typeof Worker?(await IWorker._workerImplementation[e.name].init(t),IWorker._workerImplementation[e.name]):(r||(r=`${Nimiq._path}worker.js`),IWorker.createProxy(e,t,new Worker(window.URL.createObjectURL(new Blob([`Nimiq = {_path: '${Nimiq._path}'}; importScripts('${r.replace(/'/g,"")}');`])))))}static async startWorkerPoolForProxy(e,t,r,o){return new(IWorker.Pool(e))(t=>IWorker.startWorkerForProxy(e,t,o),t,r).start()}static async stubBaseOnMessage(e){try{if("init"===e.data.command)if(IWorker._workerImplementation[e.data.args[0]]){const t=await IWorker._workerImplementation[e.data.args[0]].init(e.data.args[1]);self.postMessage({status:"OK",result:t,id:e.data.id})}else self.postMessage({status:"error",result:"Unknown worker!",id:e.data.id});else self.postMessage({status:"error",result:"Worker not yet initialized!",id:e.data.id})}catch(t){self.postMessage({status:"error",result:t,id:e.data.id})}}static get areWorkersAsync(){return"undefined"!=typeof Worker}static get _insideWebWorker(){return"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope}static get _global(){return"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:null}static prepareForWorkerUse(e,t){IWorker._insideWebWorker&&(self.onmessage=IWorker.stubBaseOnMessage),IWorker._workerImplementation=IWorker._workerImplementation||{},IWorker._workerImplementation[e.name]=t}static fireModuleLoaded(e="Module"){"function"==typeof IWorker._moduleLoadedCallbacks[e]&&(IWorker._moduleLoadedCallbacks[e](),IWorker._moduleLoadedCallbacks[e]=null)}static _loadBrowserScript(e,t){const r=document.getElementsByTagName("head")[0],o=document.createElement("script");o.type="text/javascript",o.src=e;const i=()=>window.setTimeout(t,100);o.onreadystatechange=i,o.onload=i,r.appendChild(o)}static Proxy(e){const t=class extends e{constructor(t,r){return super(),this._name=r,this._messageId=0,this._worker=t,this._worker.onmessage=this._receive.bind(this),this._waiting=new Map,this._invoke("init",[e.name,r]).then(()=>this)}_receive(e){const t=this._waiting.get(e.data.id);t?(this._waiting.delete(e.data.id),"OK"===e.data.status?t.resolve(e.data.result):"error"===e.data.status&&t.error(e.data.result)):Log.w(WorkerProxy,"Unknown reply",e)}importScript(e){return this._invoke("importScript",[e])}importWasm(e,t="Module"){return this._invoke("importWasm",[e,t])}_invoke(e,t=[]){return new Promise((r,o)=>{const i={command:e,args:t,id:this._messageId++};this._waiting.set(i.id,{resolve:r,error:o}),this._worker.postMessage(i)})}destroy(){return this._invoke("destroy")}};for(const r of Object.getOwnPropertyNames(e.prototype))"function"==typeof e.prototype[r]&&"constructor"!==r&&(t.prototype[r]=function(...e){return this._invoke(r,e)});return t}static Stub(e){const t=class extends e{constructor(){super()}_result(e,t,r){self.postMessage({status:t,result:r,id:e.data.id})}_onmessage(e){try{const t=this._invoke(e.data.command,e.data.args);t instanceof Promise?t.then(t=>{this._result(e,"OK",t)}):this._result(e,"OK",t)}catch(t){this._result(e,"error",t)}}importScript(e,t="Module"){if(t&&IWorker._global[t]&&IWorker._global[t].asm)return!1;"undefined"!=typeof Nimiq&&Nimiq._path&&(e=`${Nimiq._path}${e}`),"string"==typeof __dirname&&-1===e.indexOf("/")&&(e=`${__dirname}/${e}`);const r=IWorker._global[t]||{};return new Promise(async(o,i)=>{if(t)switch(typeof r.preRun){case"undefined":r.preRun=(()=>o(!0));break;case"function":r.preRun=[r,()=>o(!0)];break;case"object":r.preRun.push(()=>o(!0))}"function"==typeof importScripts?(await new Promise(r=>{IWorker._moduleLoadedCallbacks[t]=r,importScripts(e)}),IWorker._global[t]=IWorker._global[t](r),t||o(!0)):"object"==typeof window?(await new Promise(t=>{IWorker._loadBrowserScript(e,t)}),IWorker._global[t]=IWorker._global[t](r),t||o(!0)):"function"==typeof require?(IWorker._global[t]=require(e)(r),t||o(!0)):i("No way to load scripts.")})}importWasm(e,t="Module"){return"undefined"!=typeof Nimiq&&Nimiq._path&&(e=`${Nimiq._path}${e}`),"string"==typeof __dirname&&-1===e.indexOf("/")&&(e=`${__dirname}/${e}`),IWorker._global.WebAssembly?new Promise(r=>{try{if(PlatformUtils.isNodeJs()){const o=function(e){const t=new Uint8Array(e.length);for(let r=0;r<e.length;++r)t[r]=e[r];return t};require("fs").readFile(e,(i,s)=>{i?(Log.w(IWorker,`Failed to access WebAssembly module ${e}: ${i}`),r(!1)):(IWorker._global[t]=IWorker._global[t]||{},IWorker._global[t].wasmBinary=o(s),r(!0))})}else{const o=new XMLHttpRequest;o.open("GET",e,!0),o.responseType="arraybuffer",o.onload=function(){IWorker._global[t]=IWorker._global[t]||{},IWorker._global[t].wasmBinary=o.response,r(!0)},o.onerror=function(){Log.w(IWorker,`Failed to access WebAssembly module ${e}`),r(!1)},o.send(null)}}catch(t){Log.w(IWorker,`Failed to access WebAssembly module ${e}`),r(!1)}}):(Log.w(IWorker,"No support for WebAssembly available."),Promise.resolve(!1))}init(e){this._name=e,IWorker._insideWebWorker&&(self.name=e,self.onmessage=(e=>this._onmessage(e)))}_invoke(e,t){return this[e].apply(this,t)}destroy(){IWorker._insideWebWorker&&self.close()}};for(const r of Object.getOwnPropertyNames(e.prototype))"function"==typeof e.prototype[r]&&"constructor"!==r&&(t.prototype[r]=function(){throw`Not implemented in IWorker Stub: ${r}`});return t}static Pool(e){const t=class extends e{constructor(e,t="pool",r=1){super(),this._proxyInitializer=e,this._name=t,this._poolSize=r,this._workers=[],this._freeWorkers=[],this._waitingCalls=[]}async start(){return await this._updateToSize(),this}get poolSize(){return this._poolSize}set poolSize(e){this._poolSize=e,this._updateToSize().catch(Log.w.tag(IWorker))}destroy(){return this._poolSize=0,this._updateToSize()}_invoke(e,t){return new Promise((r,o)=>{this._waitingCalls.push({name:e,args:t,resolve:r,error:o});const i=this._freeWorkers.shift();i&&this._step(i).catch(Log.w.tag(IWorker))})}async _step(e){let t=this._waitingCalls.shift();for(;t;){try{t.resolve(await e[t.name].apply(e,t.args))}catch(e){t.error(e)}if(-1===this._workers.indexOf(e))return void e.destroy();t=this._waitingCalls.shift()}this._freeWorkers.push(e)}async _updateToSize(){"undefined"==typeof Worker&&this._poolSize>1&&(Log.d(IWorker,"Pool of size larger than 1 requires WebWorker support."),this._poolSize=1);const e=[];for(;this._workers.length+e.length<this._poolSize;)e.push(this._proxyInitializer(`${this._name}#${this._workers.length+e.length}`));const t=await Promise.all(e);for(const e of t)this._workers.push(e),this._step(e).catch(Log.w.tag(IWorker));for(;this._workers.length>this._poolSize;){const e=this._freeWorkers.shift()||this._workers.pop(),t=this._workers.indexOf(e);t>=0&&(this._workers.splice(t,1),e.destroy())}return this}};for(const r of Object.getOwnPropertyNames(e.prototype))"function"==typeof e.prototype[r]&&"constructor"!==r&&(t.prototype[r]=function(...e){return this._invoke(r,e)});return t}}IWorker._moduleLoadedCallbacks={},IWorker._workerImplementation={},Class.register(IWorker);class Crypto{static get lib(){return CryptoLib.instance}static async prepareSyncCryptoWorker(){const e=IWorker._workerImplementation[CryptoWorker.name];return await e.init("crypto"),Crypto._workerSync=e,e}static _cryptoWorkerSync(){if(null===Crypto._workerSync)throw new Error("Synchronous crypto worker not yet prepared");return Crypto._workerSync}static async _cryptoWorkerAsync(){return Crypto._workerAsync||(Crypto._workerAsync=await IWorker.startWorkerPoolForProxy(CryptoWorker,"crypto",4)),Crypto._workerAsync}static get publicKeyType(){return Uint8Array}static get publicKeySize(){return 32}static publicKeySerialize(e){return e}static publicKeyUnserialize(e){return e}static publicKeyDerive(e){return Crypto._cryptoWorkerSync().publicKeyDerive(e)}static get privateKeyType(){return Uint8Array}static get privateKeySize(){return 32}static privateKeySerialize(e){return e}static privateKeyUnserialize(e){return e}static privateKeyGenerate(){const e=new Uint8Array(Crypto.privateKeySize);return Crypto.lib.getRandomValues(e),e}static get keyPairType(){return Object}static keyPairGenerate(){return Crypto.keyPairDerive(Crypto.privateKeyGenerate())}static keyPairDerive(e){return{privateKey:e,publicKey:Crypto.publicKeyDerive(e)}}static keyPairPrivate(e){return e.privateKey}static keyPairPublic(e){return e.publicKey}static keyPairFromKeys(e,t){return{privateKey:e,publicKey:t}}static get signatureType(){return Uint8Array}static get signatureSize(){return 64}static signatureSerialize(e){return e}static signatureUnserialize(e){return e}static signatureCreate(e,t,r){return Crypto._cryptoWorkerSync().signatureCreate(e,t,r)}static signatureVerify(e,t,r){return Crypto._cryptoWorkerSync().signatureVerify(e,t,r)}static get hashType(){return Uint8Array}static get hashSize(){return 32}static get blake2bSize(){return 32}static blake2bSync(e){return Crypto._cryptoWorkerSync().computeBlake2b(e)}static async blake2bAsync(e){return(await Crypto._cryptoWorkerAsync()).computeBlake2b(e)}static get argon2dSize(){return 32}static async argon2d(e){return(await Crypto._cryptoWorkerAsync()).computeArgon2d(e)}static get sha256Size(){return 32}static sha256(e){return Crypto._cryptoWorkerSync().computeSha256(e)}static get randomnessSize(){return 32}static get commitmentPairType(){return Object}static commitmentPairGenerate(){const e=new Uint8Array(Crypto.randomnessSize);return Crypto.lib.getRandomValues(e),Crypto._cryptoWorkerSync().commitmentCreate(e)}static commitmentPairFromValues(e,t){return{secret:e,commitment:t}}static commitmentPairRandomSecret(e){return e.secret}static commitmentPairCommitment(e){return e.commitment}static get randomSecretType(){return Uint8Array}static get randomSecretSize(){return 32}static randomSecretSerialize(e){return e}static randomSecretUnserialize(e){return e}static get commitmentType(){return Uint8Array}static get commitmentSize(){return 32}static commitmentSerialize(e){return e}static commitmentUnserialize(e){return e}static get partialSignatureType(){return Uint8Array}static get partialSignatureSize(){return 32}static partialSignatureSerialize(e){return e}static partialSignatureUnserialize(e){return e}static hashPublicKeys(e){return Crypto._cryptoWorkerSync().publicKeysHash(e)}static delinearizePublicKey(e,t){const r=Crypto._cryptoWorkerSync(),o=r.publicKeysHash(e);return r.publicKeyDelinearize(t,o)}static delinearizePrivateKey(e,t,r){const o=Crypto._cryptoWorkerSync(),i=o.publicKeysHash(e);return o.privateKeyDelinearize(r,t,i)}static delinearizeAndAggregatePublicKeys(e){const t=Crypto._cryptoWorkerSync(),r=t.publicKeysHash(e);return t.publicKeysDelinearizeAndAggregate(e,r)}static delinearizedPartialSignatureCreate(e,t,r,o,i,s){return Crypto._cryptoWorkerSync().delinearizedPartialSignatureCreate(r,e,t,o,i,s)}static aggregateCommitments(e){return Crypto._cryptoWorkerSync().commitmentsAggregate(e)}static aggregatePartialSignatures(e){const t=Crypto._cryptoWorkerSync();return e.reduce((e,r)=>t.scalarsAdd(e,r))}static combinePartialSignatures(e,t){const r=Crypto.aggregatePartialSignatures(t);return BufferUtils.concatTypedArrays(e,r)}static async kdf(e,t,r=256){return(await Crypto._cryptoWorkerAsync()).kdf(e,t,r)}static async manyPow(e){const t=await Crypto._cryptoWorkerAsync(),r=t.poolSize||1,o=[];let i=0;for(let t=0;t<r;++t)for(o.push([]);i<(t+1)/r*e.length;++i)o[t].push(e[i].serialize());const s=[];for(const e of o)s.push(t.computeArgon2dBatch(e));const n=(await Promise.all(s)).reduce((e,t)=>[...e,...t],[]);for(let t=0;t<e.length;++t)e[t]._pow=new Hash(n[t])}}Crypto._workerSync=null,Crypto._workerAsync=null,Class.register(Crypto);class CryptoWorker{async computeBlake2b(e){}async computeArgon2d(e){}async computeArgon2dBatch(e){}async computeSha256(e){}async kdf(e,t,r){}async publicKeyDerive(e){}async commitmentCreate(e){}async scalarsAdd(e,t){}async commitmentsAggregate(e){}async publicKeysHash(e){}async publicKeyDelinearize(e,t){}async publicKeysDelinearizeAndAggregate(e,t){}async privateKeyDelinearize(e,t,r){}async delinearizedPartialSignatureCreate(e,t,r,o,i,s){}async signatureCreate(e,t,r){}async signatureVerify(e,t,r){}}CryptoWorker.ARGON2_HASH_SIZE=32,CryptoWorker.BLAKE2_HASH_SIZE=32,CryptoWorker.SHA256_HASH_SIZE=32,CryptoWorker.PUBLIC_KEY_SIZE=32,CryptoWorker.PRIVATE_KEY_SIZE=32,CryptoWorker.MULTISIG_RANDOMNESS_SIZE=32,CryptoWorker.SIGNATURE_SIZE=64,CryptoWorker.PARTIAL_SIGNATURE_SIZE=32,CryptoWorker.SIGNATURE_HASH_SIZE=64,Class.register(CryptoWorker);class CryptoWorkerImpl extends(IWorker.Stub(CryptoWorker)){constructor(){super(),this._superInit=super.init}async init(e){await this._superInit.call(this,e),await this.importWasm("worker-wasm.wasm")?await this.importScript("worker-wasm.js"):await this.importScript("worker-js.js");const t=Module._get_static_memory_start(),r=Module._get_static_memory_size();if(r<CryptoWorker.PUBLIC_KEY_SIZE+CryptoWorker.PRIVATE_KEY_SIZE+CryptoWorker.SIGNATURE_SIZE)throw Error("Static memory too small");let o=t;this._pubKeyPointer=o,this._pubKeyBuffer=new Uint8Array(Module.HEAP8.buffer,o,CryptoWorker.PUBLIC_KEY_SIZE),o+=CryptoWorker.PUBLIC_KEY_SIZE,this._privKeyPointer=o,this._privKeyBuffer=new Uint8Array(Module.HEAP8.buffer,o,CryptoWorker.PRIVATE_KEY_SIZE),o+=CryptoWorker.PRIVATE_KEY_SIZE,this._signaturePointer=o,this._signatureBuffer=new Uint8Array(Module.HEAP8.buffer,o,CryptoWorker.SIGNATURE_SIZE),o+=CryptoWorker.SIGNATURE_SIZE,this._messagePointer=o,this._messageBuffer=new Uint8Array(Module.HEAP8.buffer,o,t+r-o)}computeBlake2b(e){let t;try{t=Module.stackSave();const r=Module.stackAlloc(CryptoWorker.BLAKE2_HASH_SIZE),o=Module.stackAlloc(e.length);new Uint8Array(Module.HEAPU8.buffer,o,e.length).set(e);const i=Module._nimiq_blake2(r,o,e.length);if(0!==i)throw i;const s=new Uint8Array(CryptoWorker.BLAKE2_HASH_SIZE);return s.set(new Uint8Array(Module.HEAPU8.buffer,r,CryptoWorker.BLAKE2_HASH_SIZE)),s}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==t&&Module.stackRestore(t)}}computeArgon2d(e){let t;try{t=Module.stackSave();const r=Module.stackAlloc(CryptoWorker.ARGON2_HASH_SIZE),o=Module.stackAlloc(e.length);new Uint8Array(Module.HEAPU8.buffer,o,e.length).set(e);const i=Module._nimiq_argon2(r,o,e.length,512);if(0!==i)throw i;const s=new Uint8Array(CryptoWorker.ARGON2_HASH_SIZE);return s.set(new Uint8Array(Module.HEAPU8.buffer,r,CryptoWorker.ARGON2_HASH_SIZE)),s}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==t&&Module.stackRestore(t)}}computeArgon2dBatch(e){const t=[];let r;try{r=Module.stackSave();const o=Module.stackAlloc(CryptoWorker.ARGON2_HASH_SIZE),i=Module.stackSave();for(const r of e){Module.stackRestore(i);const e=Module.stackAlloc(r.length);new Uint8Array(Module.HEAPU8.buffer,e,r.length).set(r);const s=Module._nimiq_argon2(o,e,r.length,512);if(0!==s)throw s;const n=new Uint8Array(CryptoWorker.ARGON2_HASH_SIZE);n.set(new Uint8Array(Module.HEAPU8.buffer,o,CryptoWorker.ARGON2_HASH_SIZE)),t.push(n)}return t}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==r&&Module.stackRestore(r)}}computeSha256(e){let t;try{t=Module.stackSave();const r=Module.stackAlloc(CryptoWorker.SHA256_HASH_SIZE),o=Module.stackAlloc(e.length);new Uint8Array(Module.HEAPU8.buffer,o,e.length).set(e),Module._nimiq_sha256(r,o,e.length);const i=new Uint8Array(CryptoWorker.SHA256_HASH_SIZE);return i.set(new Uint8Array(Module.HEAPU8.buffer,r,CryptoWorker.SHA256_HASH_SIZE)),i}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==t&&Module.stackRestore(t)}}kdf(e,t,r){let o;try{o=Module.stackSave();const i=Module.stackAlloc(CryptoWorker.ARGON2_HASH_SIZE),s=Module.stackAlloc(e.length);new Uint8Array(Module.HEAPU8.buffer,s,e.length).set(e);const n=Module.stackAlloc(t.length);new Uint8Array(Module.HEAPU8.buffer,n,t.length).set(t);const a=Module._nimiq_kdf(i,s,e.length,n,t.length,512,r);if(0!==a)throw a;const l=new Uint8Array(CryptoWorker.ARGON2_HASH_SIZE);return l.set(new Uint8Array(Module.HEAPU8.buffer,i,CryptoWorker.ARGON2_HASH_SIZE)),l}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==o&&Module.stackRestore(o)}}publicKeyDerive(e){const t=new Uint8Array(CryptoWorker.PUBLIC_KEY_SIZE);if(e.byteLength!==CryptoWorker.PRIVATE_KEY_SIZE)throw Error("Wrong buffer size.");return this._privKeyBuffer.set(e),Module._ed25519_public_key_derive(this._pubKeyPointer,this._privKeyPointer),this._privKeyBuffer.fill(0),t.set(this._pubKeyBuffer),t}commitmentCreate(e){let t;try{t=Module.stackSave();const r=Module.stackAlloc(CryptoWorker.PUBLIC_KEY_SIZE),o=Module.stackAlloc(CryptoWorker.PRIVATE_KEY_SIZE),i=Module.stackAlloc(e.length);new Uint8Array(Module.HEAPU8.buffer,i,e.length).set(e);const s=Module._ed25519_create_commitment(o,r,i);if(1!==s)throw new Error(`Secret must not be 0 or 1: ${s}`);const n=new Uint8Array(CryptoWorker.PUBLIC_KEY_SIZE),a=new Uint8Array(CryptoWorker.PRIVATE_KEY_SIZE);return n.set(new Uint8Array(Module.HEAPU8.buffer,r,CryptoWorker.PUBLIC_KEY_SIZE)),a.set(new Uint8Array(Module.HEAPU8.buffer,o,CryptoWorker.PRIVATE_KEY_SIZE)),{commitment:n,secret:a}}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==t&&Module.stackRestore(t)}}scalarsAdd(e,t){if(e.byteLength!==CryptoWorker.PARTIAL_SIGNATURE_SIZE||t.byteLength!==CryptoWorker.PARTIAL_SIGNATURE_SIZE)throw Error("Wrong buffer size.");let r;try{r=Module.stackSave();const o=Module.stackAlloc(CryptoWorker.PARTIAL_SIGNATURE_SIZE),i=Module.stackAlloc(e.length),s=Module.stackAlloc(t.length);new Uint8Array(Module.HEAPU8.buffer,i,e.length).set(e),new Uint8Array(Module.HEAPU8.buffer,s,t.length).set(t),Module._ed25519_add_scalars(o,i,s);const n=new Uint8Array(CryptoWorker.PARTIAL_SIGNATURE_SIZE);return n.set(new Uint8Array(Module.HEAPU8.buffer,o,CryptoWorker.PARTIAL_SIGNATURE_SIZE)),n}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==r&&Module.stackRestore(r)}}commitmentsAggregate(e){if(e.some(e=>e.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE))throw Error("Wrong buffer size.");const t=new Uint8Array(e.length*CryptoWorker.PUBLIC_KEY_SIZE);for(let r=0;r<e.length;++r)t.set(e[r],r*CryptoWorker.PUBLIC_KEY_SIZE);let r;try{r=Module.stackSave();const o=Module.stackAlloc(CryptoWorker.PUBLIC_KEY_SIZE),i=Module.stackAlloc(t.length);new Uint8Array(Module.HEAPU8.buffer,i,t.length).set(t),Module._ed25519_aggregate_commitments(o,i,e.length);const s=new Uint8Array(CryptoWorker.PUBLIC_KEY_SIZE);return s.set(new Uint8Array(Module.HEAPU8.buffer,o,CryptoWorker.PUBLIC_KEY_SIZE)),s}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==r&&Module.stackRestore(r)}}publicKeysHash(e){if(e.some(e=>e.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE))throw Error("Wrong buffer size.");const t=new Uint8Array(e.length*CryptoWorker.PUBLIC_KEY_SIZE);for(let r=0;r<e.length;++r)t.set(e[r],r*CryptoWorker.PUBLIC_KEY_SIZE);let r;try{r=Module.stackSave();const o=Module.stackAlloc(CryptoWorker.SIGNATURE_HASH_SIZE),i=Module.stackAlloc(t.length);new Uint8Array(Module.HEAPU8.buffer,i,t.length).set(t),Module._ed25519_hash_public_keys(o,i,e.length);const s=new Uint8Array(CryptoWorker.SIGNATURE_HASH_SIZE);return s.set(new Uint8Array(Module.HEAPU8.buffer,o,CryptoWorker.SIGNATURE_HASH_SIZE)),s}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==r&&Module.stackRestore(r)}}publicKeyDelinearize(e,t){if(e.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE||t.byteLength!==CryptoWorker.SIGNATURE_HASH_SIZE)throw Error("Wrong buffer size.");let r;try{r=Module.stackSave();const o=Module.stackAlloc(CryptoWorker.PUBLIC_KEY_SIZE),i=Module.stackAlloc(e.length),s=Module.stackAlloc(t.length);new Uint8Array(Module.HEAPU8.buffer,i,e.length).set(e),new Uint8Array(Module.HEAPU8.buffer,s,t.length).set(t),Module._ed25519_delinearize_public_key(o,s,i);const n=new Uint8Array(CryptoWorker.PUBLIC_KEY_SIZE);return n.set(new Uint8Array(Module.HEAPU8.buffer,o,CryptoWorker.PUBLIC_KEY_SIZE)),n}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==r&&Module.stackRestore(r)}}publicKeysDelinearizeAndAggregate(e,t){if(e.some(e=>e.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE)||t.byteLength!==CryptoWorker.SIGNATURE_HASH_SIZE)throw Error("Wrong buffer size.");const r=new Uint8Array(e.length*CryptoWorker.PUBLIC_KEY_SIZE);for(let t=0;t<e.length;++t)r.set(e[t],t*CryptoWorker.PUBLIC_KEY_SIZE);let o;try{o=Module.stackSave();const i=Module.stackAlloc(CryptoWorker.PUBLIC_KEY_SIZE),s=Module.stackAlloc(r.length),n=Module.stackAlloc(t.length);new Uint8Array(Module.HEAPU8.buffer,s,r.length).set(r),new Uint8Array(Module.HEAPU8.buffer,n,t.length).set(t),Module._ed25519_aggregate_delinearized_public_keys(i,n,s,e.length);const a=new Uint8Array(CryptoWorker.PUBLIC_KEY_SIZE);return a.set(new Uint8Array(Module.HEAPU8.buffer,i,CryptoWorker.PUBLIC_KEY_SIZE)),a}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==o&&Module.stackRestore(o)}}privateKeyDelinearize(e,t,r){if(e.byteLength!==CryptoWorker.PRIVATE_KEY_SIZE||t.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE||r.byteLength!==CryptoWorker.SIGNATURE_HASH_SIZE)throw Error("Wrong buffer size.");let o;try{o=Module.stackSave();const i=Module.stackAlloc(CryptoWorker.PUBLIC_KEY_SIZE),s=Module.stackAlloc(e.length),n=Module.stackAlloc(t.length),a=Module.stackAlloc(r.length);new Uint8Array(Module.HEAPU8.buffer,s,e.length).set(e),new Uint8Array(Module.HEAPU8.buffer,n,t.length).set(t),new Uint8Array(Module.HEAPU8.buffer,a,r.length).set(r),Module._ed25519_derive_delinearized_private_key(i,a,n,s);const l=new Uint8Array(CryptoWorker.PRIVATE_KEY_SIZE);return l.set(new Uint8Array(Module.HEAPU8.buffer,i,CryptoWorker.PRIVATE_KEY_SIZE)),l}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==o&&Module.stackRestore(o)}}delinearizedPartialSignatureCreate(e,t,r,o,i,s){if(e.some(e=>e.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE)||t.byteLength!==CryptoWorker.PRIVATE_KEY_SIZE||r.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE||o.byteLength!==CryptoWorker.PRIVATE_KEY_SIZE||i.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE)throw Error("Wrong buffer size.");const n=new Uint8Array(e.length*CryptoWorker.PUBLIC_KEY_SIZE);for(let t=0;t<e.length;++t)n.set(e[t],t*CryptoWorker.PUBLIC_KEY_SIZE);let a;try{a=Module.stackSave();const l=Module.stackAlloc(CryptoWorker.PARTIAL_SIGNATURE_SIZE),c=Module.stackAlloc(n.length),u=Module.stackAlloc(t.length),y=Module.stackAlloc(r.length),_=Module.stackAlloc(o.length),h=Module.stackAlloc(i.length),g=Module.stackAlloc(s.length);new Uint8Array(Module.HEAPU8.buffer,c,n.length).set(n),new Uint8Array(Module.HEAPU8.buffer,u,t.length).set(t),new Uint8Array(Module.HEAPU8.buffer,y,r.length).set(r),new Uint8Array(Module.HEAPU8.buffer,_,o.length).set(o),new Uint8Array(Module.HEAPU8.buffer,h,i.length).set(i),new Uint8Array(Module.HEAPU8.buffer,g,s.length).set(s),Module._ed25519_delinearized_partial_sign(l,g,s.length,h,_,c,e.length,y,u);const p=new Uint8Array(CryptoWorker.PARTIAL_SIGNATURE_SIZE);return p.set(new Uint8Array(Module.HEAPU8.buffer,l,CryptoWorker.PARTIAL_SIGNATURE_SIZE)),p}catch(e){throw Log.w(CryptoWorkerImpl,e),e}finally{void 0!==a&&Module.stackRestore(a)}}signatureCreate(e,t,r){const o=new Uint8Array(CryptoWorker.SIGNATURE_SIZE),i=r.byteLength;if(i>this._messageBuffer.byteLength||t.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE||e.byteLength!==CryptoWorker.PRIVATE_KEY_SIZE)throw Error("Wrong buffer size.");return this._messageBuffer.set(r),this._pubKeyBuffer.set(t),this._privKeyBuffer.set(e),Module._ed25519_sign(this._signaturePointer,this._messagePointer,i,this._pubKeyPointer,this._privKeyPointer),this._privKeyBuffer.fill(0),o.set(this._signatureBuffer),o}signatureVerify(e,t,r){const o=t.byteLength;if(r.byteLength!==CryptoWorker.SIGNATURE_SIZE||t.byteLength>this._messageBuffer.byteLength||e.byteLength!==CryptoWorker.PUBLIC_KEY_SIZE)throw Error("Wrong buffer size.");return this._signatureBuffer.set(r),this._messageBuffer.set(t),this._pubKeyBuffer.set(e),!!Module._ed25519_verify(this._signaturePointer,this._messagePointer,o,this._pubKeyPointer)}}IWorker.prepareForWorkerUse(CryptoWorker,new CryptoWorkerImpl);class NumberUtils{static isUint8(e){return Number.isInteger(e)&&e>=0&&e<=NumberUtils.UINT8_MAX}static isUint16(e){return Number.isInteger(e)&&e>=0&&e<=NumberUtils.UINT16_MAX}static isUint32(e){return Number.isInteger(e)&&e>=0&&e<=NumberUtils.UINT32_MAX}static isUint64(e){return Number.isInteger(e)&&e>=0&&e<=NumberUtils.UINT64_MAX}static randomUint32(){return Math.floor(Math.random()*(NumberUtils.UINT32_MAX+1))}static randomUint64(){return Math.floor(Math.random()*(NumberUtils.UINT64_MAX+1))}}NumberUtils.UINT8_MAX=255,NumberUtils.UINT16_MAX=65535,NumberUtils.UINT32_MAX=4294967295,NumberUtils.UINT64_MAX=Number.MAX_SAFE_INTEGER,Class.register(NumberUtils);class BufferUtils{static toAscii(e){return String.fromCharCode.apply(null,new Uint8Array(e))}static fromAscii(e){var t=new Uint8Array(e.length);for(let r=0;r<e.length;++r)t[r]=e.charCodeAt(r);return t}static toBase64(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}static fromBase64(e){return new SerialBuffer(Uint8Array.from(atob(e),e=>e.charCodeAt(0)))}static toBase64Url(e){return BufferUtils.toBase64(e).replace(/\//g,"_").replace(/\+/g,"-").replace(/=/g,".")}static fromBase64Url(e){return new SerialBuffer(Uint8Array.from(atob(e.replace(/_/g,"/").replace(/-/g,"+").replace(/\./g,"=")),e=>e.charCodeAt(0)))}static toBase32(e,t=BufferUtils.BASE32_ALPHABET.NIMIQ){let r,o,i,s=3,n=0,a="";for(i=0;i<e.length;i++)a+=t[31&(o=n|(r=e[i])>>s)],s>5&&(a+=t[31&(o=r>>(s-=5))]),n=r<<(s=5-s),s=8-s;for(3!==s&&(a+=t[31&n]);a.length%8!=0&&33===t.length;)a+=t[32];return a}static fromBase32(e,t=BufferUtils.BASE32_ALPHABET.NIMIQ){const r=[];t.toUpperCase().split("").forEach((e,t)=>{e in r||(r[e]=t)});let o,i=8,s=0,n=[];return e.toUpperCase().split("").forEach(e=>{33===t.length&&e===t[32]||(o=255&r[e],(i-=5)>0?s|=o<<i:i<0?(n.push(s|o>>-i),s=o<<(i+=8)&255):(n.push(s|o),i=8,s=0))}),8!==i&&0!==s&&n.push(s),new Uint8Array(n)}static toHex(e){let t="";for(let r=0;r<e.length;r++){const o=e[r];t+=BufferUtils.HEX_ALPHABET[o>>>4],t+=BufferUtils.HEX_ALPHABET[15&o]}return t}static fromHex(e){return e=e.trim(),StringUtils.isHexBytes(e)?new SerialBuffer(Uint8Array.from(e.match(/.{2}/g)||[],e=>parseInt(e,16))):null}static concatTypedArrays(e,t){const r=new e.constructor(e.length+t.length);return r.set(e,0),r.set(t,e.length),r}static equals(e,t){if(e.length!==t.length)return!1;const r=new Uint8Array(e),o=new Uint8Array(t);for(let t=0;t<e.length;t++)if(r[t]!==o[t])return!1;return!0}static compare(e,t){if(e.length<t.length)return-1;if(e.length>t.length)return 1;for(let r=0;r<e.length;r++){if(e[r]<t[r])return-1;if(e[r]>t[r])return 1}return 0}static xor(e,t){const r=new Uint8Array(e.byteLength);for(let o=0;o<e.byteLength;++o)r[o]=e[o]^t[o];return r}}BufferUtils.BASE32_ALPHABET={RFC4648:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=",RFC4648_HEX:"0123456789ABCDEFGHIJKLMNOPQRSTUV=",NIMIQ:"0123456789ABCDEFGHJKLMNPQRSTUVXY"},BufferUtils.HEX_ALPHABET="0123456789abcdef",Class.register(BufferUtils);class SerialBuffer extends Uint8Array{constructor(e){super(e),this._view=new DataView(this.buffer),this._readPos=0,this._writePos=0}subarray(e,t){return ArrayUtils.subarray(this,e,t)}get readPos(){return this._readPos}set readPos(e){if(e<0||e>this.byteLength)throw`Invalid readPos ${e}`;this._readPos=e}get writePos(){return this._writePos}set writePos(e){if(e<0||e>this.byteLength)throw`Invalid writePos ${e}`;this._writePos=e}reset(){this._readPos=0,this._writePos=0}read(e){const t=this.subarray(this._readPos,this._readPos+e);return this._readPos+=e,t}write(e){this.set(e,this._writePos),this._writePos+=e.byteLength}readUint8(){return this._view.getUint8(this._readPos++)}writeUint8(e){this._view.setUint8(this._writePos++,e)}readUint16(){const e=this._view.getUint16(this._readPos);return this._readPos+=2,e}writeUint16(e){this._view.setUint16(this._writePos,e),this._writePos+=2}readUint32(){const e=this._view.getUint32(this._readPos);return this._readPos+=4,e}writeUint32(e){this._view.setUint32(this._writePos,e),this._writePos+=4}readUint64(){const e=this._view.getUint32(this._readPos)*Math.pow(2,32)+this._view.getUint32(this._readPos+4);if(!NumberUtils.isUint64(e))throw new Error("Malformed value");return this._readPos+=8,e}writeUint64(e){if(!NumberUtils.isUint64(e))throw new Error("Malformed value");this._view.setUint32(this._writePos,Math.floor(e/Math.pow(2,32))),this._view.setUint32(this._writePos+4,e),this._writePos+=8}readVarUint(){const e=this.readUint8();return e<253?e:253===e?this.readUint16():254===e?this.readUint32():this.readUint64()}writeVarUint(e){if(!NumberUtils.isUint64(e))throw new Error("Malformed value");e<253?this.writeUint8(e):e<=65535?(this.writeUint8(253),this.writeUint16(e)):e<=4294967295?(this.writeUint8(254),this.writeUint32(e)):(this.writeUint8(255),this.writeUint64(e))}static varUintSize(e){if(!NumberUtils.isUint64(e))throw new Error("Malformed value");return e<253?1:e<=65535?3:e<=4294967295?5:9}readFloat64(){const e=this._view.getFloat64(this._readPos);return this._readPos+=8,e}writeFloat64(e){this._view.setFloat64(this._writePos,e),this._writePos+=8}readString(e){const t=this.read(e);return BufferUtils.toAscii(t)}writeString(e,t){if(StringUtils.isMultibyte(e)||e.length!==t)throw"Malformed value/length";const r=BufferUtils.fromAscii(e);this.write(r)}readPaddedString(e){const t=this.read(e);let r=0;for(;r<e&&0!==t[r];)r++;const o=new Uint8Array(t.buffer,t.byteOffset,r);return BufferUtils.toAscii(o)}writePaddedString(e,t){if(StringUtils.isMultibyte(e)||e.length>t)throw"Malformed value/length";const r=BufferUtils.fromAscii(e);this.write(r);const o=t-r.byteLength;this.write(new Uint8Array(o))}readVarLengthString(){const e=this.readUint8();if(this._readPos+e>this.length)throw"Malformed length";const t=this.read(e);return BufferUtils.toAscii(t)}writeVarLengthString(e){if(StringUtils.isMultibyte(e)||!NumberUtils.isUint8(e.length))throw new Error("Malformed value");const t=BufferUtils.fromAscii(e);this.writeUint8(t.byteLength),this.write(t)}static varLengthStringSize(e){if(StringUtils.isMultibyte(e)||!NumberUtils.isUint8(e.length))throw new Error("Malformed value");return 1+e.length}}Class.register(SerialBuffer);class MinerWorker{async multiMine(e,t,r,o){}}Class.register(MinerWorker);class MinerWorkerImpl extends(IWorker.Stub(MinerWorker)){constructor(){super(),this._superInit=super.init}async init(e){await this._superInit.call(this,e),await this.importWasm("worker-wasm.wasm")?await this.importScript("worker-wasm.js"):await this.importScript("worker-js.js")}async multiMine(e,t,r,o){const i=new Uint8Array(32);let s,n;try{s=Module._malloc(i.length),n=Module._malloc(e.length),Module.HEAPU8.set(e,n);const a=Module._nimiq_argon2_target(s,n,e.length,t,r,o,512);return a!==o&&(i.set(new Uint8Array(Module.HEAPU8.buffer,s,i.length)),{hash:i,nonce:a})}catch(e){throw Log.w(MinerWorkerImpl,e),e}finally{void 0!==s&&Module._free(s),void 0!==n&&Module._free(n)}}}IWorker.prepareForWorkerUse(MinerWorker,new MinerWorkerImpl);class MinerWorkerPool extends(IWorker.Pool(MinerWorker)){constructor(e=1){if(super(e=>IWorker.startWorkerForProxy(MinerWorker,e),"miner",e),this._miningEnabled=!1,this._activeNonces=[],this._block=null,this._noncesPerRun=256,this._observable=new Observable,this._shareCompact=Policy.BLOCK_TARGET_MAX,this._runsPerCycle=1/0,this._cycleWait=100,this._superUpdateToSize=super._updateToSize,PlatformUtils.isNodeJs()){const e=require(`${__dirname}/nimiq_node`);this.multiMine=function(t,r,o,i){return new Promise((s,n)=>{e.nimiq_argon2_target_async(async e=>{try{if(e===i)s(!1);else{t.writePos-=4,t.writeUint32(e);const r=await Crypto.argon2d(t);s({hash:r,nonce:e})}}catch(e){n(e)}},t,r,o,i,512)})}}}get noncesPerRun(){return this._noncesPerRun}set noncesPerRun(e){this._noncesPerRun=e}get runsPerCycle(){return this._runsPerCycle}set runsPerCycle(e){this._runsPerCycle=e}get cycleWait(){return this._cycleWait}set cycleWait(e){this._cycleWait=e}on(e,t){this._observable.on(e,t)}off(e,t){this._observable.off(e,t)}async startMiningOnBlock(e,t=e.nBits){if(this._block=e,this._shareCompact=t,this._miningEnabled)this._activeNonces=[{minNonce:0,maxNonce:0}];else{await this._updateToSize(),this._activeNonces=[],this._miningEnabled=!0;for(let e=0;e<this.poolSize;++e)this._startMiner()}}stop(){this._miningEnabled=!1}async _updateToSize(){for(PlatformUtils.isNodeJs()||await this._superUpdateToSize.call(this);this._miningEnabled&&this._activeNonces.length<this.poolSize;)this._startMiner()}_startMiner(){const e=0===this._activeNonces.length?0:Math.max.apply(null,this._activeNonces.map(e=>e.maxNonce)),t={minNonce:e,maxNonce:e+this._noncesPerRun};this._activeNonces.push(t),this._singleMiner(t).catch(e=>Log.e(MinerWorkerPool,e))}async _singleMiner(e){let t=0;for(;this._miningEnabled&&(IWorker.areWorkersAsync||PlatformUtils.isNodeJs()||0===t)&&t<this._runsPerCycle;){t++;const r=this._block,o=await this.multiMine(r.header.serialize(),this._shareCompact,e.minNonce,e.maxNonce);if(o){const e=new Hash(o.hash);this._observable.fire("share",{block:r,nonce:o.nonce,hash:e})}else this._observable.fire("no-share",{nonce:e.maxNonce});if(this._activeNonces.length>this.poolSize)return void this._activeNonces.splice(this._activeNonces.indexOf(e),1);{const t=Math.max.apply(null,this._activeNonces.map(e=>e.maxNonce)),r={minNonce:t,maxNonce:t+this._noncesPerRun};this._activeNonces.splice(this._activeNonces.indexOf(e),1,r),e=r}}this._miningEnabled&&setTimeout(()=>this._singleMiner(e),this._cycleWait)}}Class.register(MinerWorkerPool);
//# sourceMappingURL=worker.js.map