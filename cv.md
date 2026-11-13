# Enaide Corrales Fernández

**Ingeniero DevOps · Infraestructura como código (Terraform, Ansible) · Kubernetes · AWS · Linux RHEL**

A Coruña, Galicia (España) · [ecfcode@gmail.com](mailto:ecfcode@gmail.com) · +34 644 753 633 · [enaide.github.io](https://enaide.github.io/) · Docker Hub: [docker.io/ecfcode](https://hub.docker.com/u/ecfcode)

---

## Perfil

Ingeniero DevOps con 15 años en TI. Empecé administrando redes, virtualización y servidores Linux/Windows (2011–2018), pasé siete años construyendo y operando aplicaciones Java/Spring, Angular y serverless en AWS (2018–2025) y desde 2025 administro infraestructura cloud y entornos en contenedores. Esa combinación me permite diseñar plataformas pensando en quien las despliega y en quien las opera.

Construyo entornos reproducibles y seguros por defecto: infraestructura como código con Terraform y Ansible, clústeres Kubernetes con kubeadm y Helm, contenedores rootless con Podman, imágenes distroless y scratch sin root, todo sobre RHEL, Fedora y Amazon Linux con SELinux activo. Cada decisión de ingeniería queda documentada con su beneficio, sus riesgos abiertos y los pasos pendientes antes de producción.

---

## Competencias técnicas

| Área | Tecnologías |
|---|---|
| **Infraestructura como código** | Terraform (≥1.6, provider AWS 6.x, backend S3, `templatefile`, `null_resource`), Ansible (playbooks, handlers, Vault, idempotencia, ansible-navigator), Vagrant + VirtualBox |
| **Kubernetes** | kubeadm (control-plane + workers), Helm 4 (charts, dependencias, helm-diff), Calico (Tigera operator, VXLAN), minikube, `securityContext` endurecido, Secrets |
| **Contenedores** | Podman rootless (`keep-id`, SELinux `:Z`), Docker, Compose (perfiles, healthchecks, userns), Dockerfiles multi-stage, imágenes distroless y scratch, usuarios no-root, Dev Containers, Portainer |
| **AWS** | EC2 (Spot, AMI, `user_data`, IMDSv2), VPC y Security Groups, IAM (roles e instance profiles de mínimo privilegio), S3, SSM Parameter Store, SQS, Amplify |
| **Linux y sistemas** | RHEL 9, Fedora, Amazon Linux 2023, CentOS, Ubuntu; SELinux, firewalld, systemd, Bash; VMware vSphere, SAN iSCSI, Windows Server |
| **Red, proxies y TLS** | Traefik, Nginx, Apache httpd, PHP-FPM, TLS automático, proxies inversos y balanceo; routers Cisco, NetFlow |
| **Bases de datos** | PostgreSQL, MariaDB/MySQL, Redis, MongoDB, SQL Server, Oracle (administración, curso 2026) |
| **CI/CD y herramientas** | Git, GitHub, Bitbucket, Jenkins, Jira, podman-compose, VS Code |
| **Desarrollo (base previa)** | Java 17 / Spring Boot 3, Node.js 24 / Express, Python (Django, FastAPI), Go, C# / .NET, Angular, React, TypeScript, PHP / Laravel, GraphQL |

---

## Proyectos técnicos (laboratorios propios, documentados)

Cada proyecto incluye un README con decisiones de ingeniería, requisitos, resolución de problemas, análisis de seguridad y limitaciones conocidas.

### Clúster Kubernetes en AWS con Terraform — `terraform-k8s-cluster`

*IaC · kubeadm · AWS*

- 3 nodos EC2 Spot (1 control-plane, 2 workers) sobre Amazon Linux 2023, con VPC, subred, IGW, Security Groups por rol e IAM acotado por ruta de SSM y por bucket.
- Bootstrap con `user_data` mínimo: los scripts viven en S3 y un orquestador por fases (swap, módulos, sysctl, containerd, kubeadm) verifica cada paso y registra logs independientes.
- Los nodos se coordinan sin SSH entre ellos ni provisioners: el control-plane publica el *join command* como SecureString en SSM Parameter Store y los workers lo consumen con timeout y comprobación de `/healthz`.
- El `terraform apply` no termina hasta que el clúster está validado desde Terraform (SSM, SSH y nodos Ready). Calico vía Tigera operator; estado remoto en S3.

**Tecnologías:** Terraform ≥1.6, provider AWS 6.x, EC2 Spot, IAM, S3, SSM, kubeadm, containerd, Calico 3.28, Bash

### Despliegue LAMP automatizado con Ansible sobre RHEL 9 — `ansible-lamp-rhel9`

*Vagrant · Ansible · SELinux*

- Tres VMs RHEL 9 (control + 2 nodos) en red host-only con puertos deterministas; nodo de control con Ansible (AAP 2.6) y claves ED25519 distribuidas automáticamente.
- Playbook único con *pre-flight* (assert de SO y conectividad), hardening de MariaDB (bind local, sin cuentas por defecto, usuario de mínimo privilegio) y verificación end-to-end HTTP 200 con contenido real de BD.
- SELinux activo mediante booleanos persistentes y `restorecon`; firewalld limitado a http/https; secretos separados en `vars/secrets.yml`, preparados para Ansible Vault; handlers con `flush_handlers` para reinicios controlados.

**Tecnologías:** Vagrant, VirtualBox, RHEL 9, ansible-core, Jinja2, Apache httpd, PHP-FPM, MariaDB, SELinux, firewalld

### Servicio Node.js reproducible: Dev Container, imagen distroless y chart de Helm — `api-config-store` · `helm-api-config-store`

*Podman · Kubernetes · Helm*

- Dev Container sobre Podman rootless con `userns_mode: keep-id`, bind mount etiquetado para SELinux, `node_modules` en volumen y PostgreSQL 17 con healthcheck y `depends_on: service_healthy`.
- Dockerfile multi-stage con una única versión de Node (24) y Debian 13 en todas las etapas; producción sobre distroless no-root (UID 65532) sin shell ni curl, con `HEALTHCHECK` ejecutado por el propio binario de Node.
- Arranque *fail-fast*, apagado ordenado ante SIGTERM/SIGINT con temporizador de seguridad y endpoint `/health`.
- Chart de Helm con PostgreSQL como dependencia: Secret externo leído como fichero, app con `runAsUser`, raíz de solo lectura y capabilities eliminadas; upgrades con `--dry-run=server` y helm-diff.

**Tecnologías:** Node.js 24, Express, Sequelize, PostgreSQL 17, Podman 5, Dev Containers, distroless, Helm 4, minikube, Kubernetes

### Plantilla de flujo de trabajo con Podman para C#, Go, Node.js y Python — `podman-micro-services`

*Contenedores · multi-stage*

- Un único `docker-compose.yaml` con 8 servicios (dev y prod bajo perfil) y Dockerfiles multi-stage por stack con targets dev / build / prod y *cache mounts*.
- Producción sin root en los cuatro stacks: Go en `scratch` con binario estático; Python con venv copiado a imagen slim; Node con `npm ci --omit=dev`; .NET con `dotnet publish` sobre runtime sin SDK.
- Hot reload sobre bind mounts, manejo de señales con `init` y puertos independientes por stack.

**Tecnologías:** .NET 8, Go 1.27, Node.js 24, Python 3.13 / FastAPI, Alpine, Debian slim, Podman, Compose

---

## Experiencia profesional

### Fundador y administrador de sistemas cloud — Cognidatum
*Galicia, España · 04/2025 – actualidad*

- Diseño, aprovisionamiento y mantenimiento de entornos Linux en VPS (Contabo).
- Arquitecturas en contenedores con Docker y gestión centralizada con Portainer.
- Traefik y Nginx como proxies inversos con terminación TLS automática y balanceo para varias aplicaciones, incluidas instancias de WordPress.
- Despliegue, securización y mantenimiento de PostgreSQL, MariaDB y Redis.

**Tecnologías:** Linux, Docker, Portainer, Traefik, Nginx, TLS, WordPress, PostgreSQL, MariaDB, Redis

### Desarrollo backend y full stack sobre contenedores y AWS — 2018 – 2025

Siete años construyendo aplicaciones que se desplegaban en Docker, Kubernetes y AWS, lo que da contexto directo sobre qué necesita un equipo de desarrollo de la plataforma.

- **Getronics** (cliente: Generalitat de Catalunya) · Desarrollador backend · 06/2024 – 03/2025 — Gestión de expedientes y trámites de inmigración: análisis de requisitos, diseño y desarrollo de componentes, corrección de errores y soporte técnico. *Java 17, Spring Boot 3.x, JUnit 5, microservicios, Kubernetes, Docker, Git.*
- **Vortechgroup PCI** (cliente: Gobierno de Andalucía) · Desarrollador web full stack · 08/2023 – 04/2024 — Sistema de control horario de RR. HH.: componentes, APIs, consultas SQL y corrección de errores. *React, Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security, Docker, GitHub.*
- **Datamartin** (consultora canadiense) · Desarrollador Angular senior · Buenos Aires · 04/2022 – 06/2023 — Hospitality Concierge, sistema de gestión de citas: frontend Angular e integración con AWS. *Angular, TypeScript, AWS (GraphQL, Amplify, S3), Docker, Jenkins, Bitbucket.*
- **Fivana** (financiación para pymes) · Ingeniero full stack senior · Santiago de Chile · 07/2018 – 04/2022 — Backoffice de factoring: desarrollo frontend y backend y soporte técnico de microservicios serverless en AWS. *Angular, TypeScript, Spring Boot 2.x, Spring Data JPA, Spring Security, AWS (GraphQL, Amplify, S3, SQS).*
- **Datacimex** (Corporación CIMEX) · Desarrollador móvil y full stack · Cuba · 2017 – 2018 — Aplicaciones móviles de comercio electrónico y sistema de reportes Western Union Statistic. *Android, Ionic, Angular, PHP/Laravel, Python, Django, MongoDB.*

### Ingeniero de redes TIC y seguridad informática — Corporación CIMEX, nodo Holguín
*Holguín, Cuba · 11/2011 – 01/2018*

- Administración de una red corporativa de transmisión de datos y servicios; máxima calificación en auditorías de seguridad del OSRI en todos los departamentos auditados de la división.
- Virtualización con VMware vSphere 5.1 en HP DL380p G8 y SAN HP P2000 G3 MSA iSCSI; routers Cisco 2811/1941/1841/2600/1700; monitorización con ManageEngine NetFlow Analyzer.
- Windows Server 2003/2008 R2 con SQL Server 2008 R2; servidores Linux CentOS y Ubuntu; instalación de sistemas Western Union.

**Tecnologías:** VMware vSphere, SAN iSCSI, Cisco, NetFlow Analyzer, Windows Server, SQL Server, CentOS, Ubuntu

---

## Formación, certificaciones e idiomas

| Año | Formación |
|---|---|
| 2026 | **Administración de bases de datos en Oracle** (IFCT005PO, 40 h presencial) — CAS Training, programa SEPE / NextGenerationEU |
| 2025 | **Certificado profesional Google: Automatización de TI con Python** (incluye *Configuration Management and the Cloud*) — Coursera |
| 2021 | **AWS Technical Essentials** y **Architecting on AWS** — formación oficial AWS, Santiago de Chile |
| 2002–2007 | **Ingeniero en Ciencias Informáticas** — Universidad de Ciencias Informáticas (UCI), La Habana |
| Idiomas | **Español:** nativo · **Inglés:** B1 |
