# cf-dyn-dns

This is a small project that updates a Cloudflare DNS record with the current
public IP address of the machine it is running on.

It should run frequently, probably with a service system like systemd, for which
a unit file is provided.

## Installation

Follow these steps

```bash
git clone https://github.com/t-mart/cf-dyn-dns.git
cd cf-dyn-dns
mkdir ~/.local
deno --allow-net --allow-env --global --root ~/.local --name cf-dyn-dns npm:main.ts
```

Then, run with

```bash
cf-dyn-dns
```

## Running as a systemd service

1. Update the `cf-dyn-dns.service` as necessary, especially the environment
   variables.

2. Add the service and timer files to the systemd directory:

   ```bash
   sudo cp cf-dyn-dns.service /etc/systemd/system/
   sudo cp cf-dyn-dns.timer /etc/systemd/system/
   ```

3. Enable and start the service:

   ```bash
   sudo systemctl enable cf-dyn-dns
   sudo systemctl start cf-dyn-dns
   ```

   and check the status and the logs:

   ```bash
   sudo systemctl status cf-dyn-dns
   journalctl -u cf-dyn-dns
   ```
