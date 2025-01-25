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
deno cf-dyn-dns
```

## Running as a systemd service

1. Add the service and timer files to the systemd directory:

   ```bash
   sudo cp cf-dyn-dns.service /etc/systemd/system/
   sudo cp cf-dyn-dns.timer /etc/systemd/system/
   ```

2. Update the `cf-dyn-dns.service` file, at least filling in the environment
   variables.

3. Enable and start the service:

   ```bash
   sudo systemctl enable cf-dyn-dns.service
   sudo systemctl enable cf-dyn-dns.timer
   sudo systemctl start cf-dyn-dns.service
   sudo systemctl start cf-dyn-dns.timer
   ```

   and check the status and the logs:

   ```bash
   sudo systemctl status cf-dyn-dns
   journalctl -u cf-dyn-dns
   ```
