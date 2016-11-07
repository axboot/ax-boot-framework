sudo -u root -H sh -c "useradd deploy -p deploy#1#1!"
sudo -u root -H sh -c "mkdir -p /home/deploy/.ssh"
sudo -u root -H sh -c "echo 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCtNhrRLKMses71F1pSzuhJFIfmzaW0eodfGSme+kzVYsthFZiYc/IoxZ059NIgC/DHl8bjcOhnpq5fnSXhdNgdcECnTK3ouPbR+qwTbA1lzKwIU0HEmFKAzo1+KEPDTXec87vQmLsrgRb4xu3nSufQ3TaMBFZJSnKrh2Z9CxL0diqhbd+04c7NJmJdVi3ofYVE+oIOI9ur4HFvlQXOaBhzj5f45fEuhpSm03f8tzpLezK+dQELwBAktlPDjcA/WDiqhYrDqvo8tq3QEWti2nKEJw6nsuKwDZuo6rZkCd7+WLW6rpeg00KHPCH195HgHuseeTEYZ4CiLWz7B4JzpOh7 brant@Brantui-iMac-2.local
ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEArnoN4cng89/NQiUSLGE7B+607ObYB6bGWpP0HSZM0CzpfyeHqM6myH3edQK8sIrG45C0brsjm5wJqO/DKp6r6Z3V0sOKZ1NOmax2/Nv5NqPG+ZoXoWzyghVS/yLblhe9nTn2FG4ekD59a6vTD0pN+5KPufKnmEyOujCvkdKLm2iE5UQv+VsCJVMw8hZ4AuG7O75nr/AJ20dBWLDZiB6kLz4OC/2pyts5sD1yCHC2Ojr/A8uZI8qyU3wa7dwuJQgw1zZLmPkg99fusbZpuy76tabg0mqwiP8Rqm3IeMRiI94TBKs0D4j3HDcUVk32fkN5kHHrmyJRiDXrjRHaoy0pww== deploy@chequer' > /home/deploy/.ssh/authorized_keys"
sudo -u root -H sh -c "echo 'Host *
        StrictHostKeyChecking no
        UserKnownHostsFile /dev/null
        LogLevel ERROR' > /home/deploy/.ssh/config"
sudo -u root -H sh -c "chmod 644 /home/deploy/.ssh/authorized_keys"
sudo -u root -H sh -c "chmod 700 /home/deploy/.ssh"
sudo -u root -H sh -c "chown -R deploy:deploy /home/deploy/.ssh"
sudo -u root -H sh -c "echo 'deploy  ALL=NOPASSWD:   ALL' >> /etc/sudoers"