sshout
======

Command line utility for running remote commands over ssh.

## Install

```
$ npm install -g sshout
```

## Usage

Adds the `sshout` command when installed globally. Takes everything after `sshout` and runs that command from a hosted folder on the server.

## Features

* Secure through ssh (well duh).
* `require()`'able so you can call it from node.
* Since the client is very dumb and the server has all the logic, there is no need to keep clients up to date.
* Scripts can be written in any scripting language.

## Example - CLI

Lets create an example environment where we can execute remote commands over ssh. We need the following:

* A folder with some scripts, accessible over ssh.
* A configuration file for `sshout` defining `user`, `host`, `port` (optional) and `scripts` (optional).

Lets assume the scripts folder on the server is located in the user `$HOME` folder and called `myscripts`. Lets also assume the scripts are hosted on the server `example.com` and that the user is `ubuntu`. We start by creating a configuration file `~/.sshoutrc`, which can be either in `json` or `ini` format.

We will pick json for our configuration:

```json
{
  "host": "example.com",
  "user": "ubuntu",
  "scripts": "myscripts"
}
```

Lets add the following script on the server and lets call it `beepboop`:

```bash
#!/bin/bash
echo 'beep boop'
```

We can now run this script remotely with the following command:

```
$ sshout beepboop
beep boop
```

No arguments or `list` lists available commands:

```
$ sshout
The following commands are available:
 beepboop
```

## API

This module exports a constructor function, which returns a function for running remote ssh commands programmatically.

### `var ssh = require('sshout')([config])`

* `config` *(object)* Optional configuration object. See `configuration` below. If set, overrides configuration provided by `rc`.

### `ssh(cmd[, callback])`

* `cmd` *(string)* Command to execute on the server.
* `callback` *(function)* Optional callback. Called with an `Error` object if the remote command failed.

## Example - API

```js
var ssh = require('sshout')({
  host: 'example.com',
  user: 'ubuntu',
  port: 22,
  scripts: 'myscripts',
})
ssh('beepboop', function (err) {})
ssh('somescript arg1 arg2 --flag=value', function (err) {})
```

## Configuration

Configuration for `sshout` is powered by [`rc`](https://github.com/dominictarr/rc) and takes the following properties:

* `user` *(string)*: Login as this user.
* `host` *(string)*: Server host.
* `port` *(number, default: 22)*: Server port.
* `scripts` *(string, default: `scripts`)*: Path to the folder hosting the commands, relative to `$HOME` for the current user. It can also be an absolute path.

See [this](https://github.com/dominictarr/rc#standards) for more information on how `rc` handles file locations and [this](https://github.com/dominictarr/rc#configuration-file-formats) for information on the different file formats.
