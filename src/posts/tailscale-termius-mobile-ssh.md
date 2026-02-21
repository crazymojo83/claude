---
slug: 'my-new-post-url'
category: 'coding'
label: 'React'
date: 'Mar 2026'
readTime: '4 min read'
title: 'Your Amazing Blog Title'
excerpt: 'A brief sentence explaining what the post is about.'
---




# 📱 Mobile SSH Access to Cloud Terminal via Tailscale + Termius

**Branch:** `claude`  
**Date:** 2026-02-16  
**Status:** ✅ Working

---

## Overview

One of the biggest friction points in managing remote infrastructure is being tethered to a laptop just to get a terminal. This update documents how I configured full SSH access to my cloud terminal directly from my phone — no port forwarding, no exposed ports, no VPN hairpinning through HQ. Just clean, zero-config mesh networking courtesy of **Tailscale** and a polished mobile SSH client called **Termius**.

Pocket-sized sysadmin. Turns out that's a real thing now.

---

## Why This Matters

When you're managing multi-campus infrastructure and something decides to have a bad day at 9 PM, the difference between "I'll handle it when I get to a laptop" and "give me 30 seconds" is significant. This setup puts a full terminal in your hand wherever you are — coffee shop, parking lot, or the inevitable Saturday morning while you're supposed to be doing something else entirely.

---

## The Stack

| Component | Role |
|-----------|------|
| **Tailscale** | Zero-config mesh VPN — connects devices regardless of NAT/firewall |
| **Termius** | Professional mobile SSH client (iOS/Android) |
| **SSH** | Good old secure shell, doing what it always does |

---

## Prerequisites

- Tailscale installed on both your **cloud/server machine** and your **phone**
- SSH server running on the target machine (`openssh-server` on Linux or enabled in Windows settings)
- Both devices authenticated to the **same Tailscale account (or tailnet)**
- Termius installed on your mobile device

---

## Setup Steps

### 1. Confirm Tailscale is Running on Both Devices

On your server/cloud machine:
```bash
tailscale status
```

You should see your mobile device listed (once it's connected). Make note of your server's **Tailscale IP** — it'll look something like `100.x.x.x`.

On your phone: Open the Tailscale app and confirm it shows "Connected" and your server appears in the device list.

### 2. Verify SSH is Accessible Locally

Before going mobile, confirm SSH works on the machine itself:
```bash
# On Linux/Mac
ssh localhost

# Or check the service is running
sudo systemctl status ssh
```

On Windows, verify OpenSSH Server is installed and running:
```powershell
Get-Service -Name sshd
```

### 3. Configure Termius on Your Phone

1. Open **Termius** → tap **+** → **New Host**
2. Fill in the following:

   | Field | Value |
   |-------|-------|
   | **Hostname/IP** | Your Tailscale IP (e.g. `100.64.0.5`) |
   | **Port** | `22` (default SSH) |
   | **Username** | Your server username |
   | **Authentication** | Password or SSH key (key recommended) |
   | **Label** | Whatever you want — `SATURN`, `Cloud Terminal`, etc. |

3. Tap **Save**

### 4. Connect

Tap your saved host in Termius. If Tailscale is connected on your phone and SSH is running on the server — you're in. Full terminal, from your pocket.

---

## Using SSH Keys (Recommended)

Passwords work, but keys are cleaner and more secure. In Termius:

1. Go to **Keychain** in the sidebar
2. Tap **+** → **Generate** a new key pair (or import an existing one)
3. Copy the **public key** and add it to your server's `~/.ssh/authorized_keys`
4. Link the key to your saved host

Now you're in with no password prompt. Slick.

---

## Why Tailscale Instead of Direct SSH?

Good question. The traditional approach would be:
- Open a port on your firewall/router (usually 22)
- Point DNS or a static IP at it
- Hope bots don't hammer it

Tailscale sidesteps all of that:
- **No open ports** on your server or router
- **Encrypted WireGuard tunnel** between devices
- Works through NAT, CGNAT, corporate firewalls — basically everything
- Access is scoped to **your tailnet only**, not the open internet

It's the kind of setup that makes network engineers nod approvingly and security folks breathe a sigh of relief.

---

## Tips & Notes

- **Termius has a snippet library** — great for storing frequently used commands you'd normally have memorized (or Googled for the 47th time)
- **Split view works on iPad** — run two SSH sessions side by side
- The **Termius SFTP browser** lets you browse and transfer files without typing a single `scp` command
- Tailscale's **MagicDNS** lets you use hostnames instead of IPs (e.g. `ssh SATURN` instead of `ssh 100.64.0.5`)

---

## Result

Full terminal access to my cloud environment from anywhere, with zero exposed attack surface. Works on cellular, works on public Wi-Fi, works anywhere Tailscale is connected — which is basically always.

This is now part of my standard mobile ops workflow alongside the Tailscale app itself. If something needs attention and I'm not at a desk, this is how it gets handled.

---

*Documented in the `claude` branch as part of ongoing infrastructure workflow automation and mobility improvements.*
