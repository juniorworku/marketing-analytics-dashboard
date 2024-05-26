import paramiko
import os

# Remote server connection parameters
remote_host = "remote_host"
remote_user = "remote_user"
remote_password = "remote_password"
remote_dashboard_dir = "/path/to/remote/dashboard/directory"

# Local directory containing dashboards
local_dashboard_dir = "dashboards/"

# Establish SSH connection
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(remote_host, username=remote_user, password=remote_password)

# Upload dashboards to remote server
sftp = ssh.open_sftp()
for dashboard_file in os.listdir(local_dashboard_dir):
    local_file_path = os.path.join(local_dashboard_dir, dashboard_file)
    remote_file_path = os.path.join(remote_dashboard_dir, dashboard_file)
    sftp.put(local_file_path, remote_file_path)
    print(f"Uploaded {dashboard_file} to remote server.")

# Close SFTP and SSH connections
sftp.close()
ssh.close()

print("Dashboard migration completed successfully.")
