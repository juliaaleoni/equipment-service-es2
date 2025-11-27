# Equipment Service - SCB

Serviço de gerenciamento de equipamentos do Sistema de Compartilhamento de Bicicletas (SCB).

## 📋 Descrição

O Equipment Service é o microserviço principal responsável por gerenciar todos os equipamentos físicos do SCB, incluindo:

- **Bicicletas**: Gerenciamento completo do ciclo de vida das bicicletas (cadastro, status, manutenção, aposentadoria)
- **Trancas**: Controle de trancas inteligentes (trancar/destrancar, associação com bicicletas)
- **Totems**: Gestão de totems (pontos de aluguel) e suas trancas
- **Integração de Rede**: Operações de incluir/retirar equipamentos da rede operacional

## 🚀 Tecnologias

- **Node.js** 18+
- **NestJS** 11 - Framework progressivo para Node.js
- **TypeScript** 5.7 - Superset tipado de JavaScript
- **PostgreSQL** - Banco de dados relacional
- **TypeORM** - ORM para TypeScript/JavaScript
- **Jest** - Framework de testes
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de objetos

## 📦 Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL 14 ou superior
- pnpm (gerenciador de pacotes)

## 🔧 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd equipment-service

# Instale as dependências
pnpm install
```

## ⚙️ Configuração

1. **Crie o arquivo `.env`** na raiz do projeto:

```bash
cp .env.example .env
```

2. **Configure as variáveis de ambiente**:

```env
# Aplicação
NODE_ENV=development
PORT=3000

# Banco de Dados
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/equipment_service

# External Service (opcional para desenvolvimento)
EXTERNAL_SERVICE_URL=http://localhost:3001
```

## 🏃 Executando o Projeto

### Desenvolvimento

```bash
# Modo desenvolvimento com hot-reload
pnpm start:dev

# Servidor estará disponível em http://localhost:3000
```

### Produção

```bash
# Build do projeto
pnpm build

# Executar em produção
pnpm start:prod
```

## 🧪 Testes

```bash
# Testes unitários
pnpm test

# Testes com coverage
pnpm test:cov

# Testes em modo watch
pnpm test:watch

# Testes E2E
pnpm test:e2e

# Linter
pnpm lint
```

## 📚 Documentação da API

### Bicicletas

#### `POST /bicicleta`
Cria uma nova bicicleta.

**Request:**
```json
{
  "marca": "Caloi",
  "modelo": "Elite Carbon",
  "ano": "2024",
  "numero": 123
}
```

**Response:** `201 Created`

#### `GET /bicicleta`
Lista todas as bicicletas.

#### `GET /bicicleta/:id`
Retorna uma bicicleta específica.

#### `PUT /bicicleta/:id`
Atualiza os dados de uma bicicleta.

#### `DELETE /bicicleta/:id`
Remove uma bicicleta do sistema.

**Response:** `200 OK`

#### `POST /bicicleta/:id/status/:action`
Atualiza o status de uma bicicleta.

**Ações disponíveis:**
- `DISPONIVEL` - Marca como disponível
- `EM_USO` - Marca como em uso
- `NOVA` - Marca como nova
- `APOSENTADA` - Aposenta a bicicleta
- `REPARO_SOLICITADO` - Solicita reparo
- `EM_REPARO` - Marca como em reparo

**Exemplo:**
```
POST /bicicleta/1/status/DISPONIVEL
```

#### `POST /bicicleta/integrarNaRede`
Integra uma bicicleta na rede operacional (associa a uma tranca).

**Request:**
```json
{
  "idTranca": 1,
  "idBicicleta": 5,
  "idFuncionario": 10
}
```

**Response:** `200 OK`

#### `POST /bicicleta/retirarDaRede`
Remove uma bicicleta da rede para manutenção/reparo.

**Request:**
```json
{
  "idTranca": 1,
  "idBicicleta": 5,
  "idFuncionario": 10,
  "statusAcaoReparador": "EM_REPARO"
}
```

**Response:** `200 OK`

### Trancas

#### `POST /tranca`
Cria uma nova tranca.

**Request:**
```json
{
  "numero": 42,
  "localizacao": "Parque Ibirapuera - Portão 3",
  "modelo": "Smart Lock X1"
}
```

#### `GET /tranca`
Lista todas as trancas.

#### `GET /tranca/:id`
Retorna uma tranca específica.

#### `PUT /tranca/:id`
Atualiza os dados de uma tranca.

#### `DELETE /tranca/:id`
Remove uma tranca do sistema.

**Response:** `200 OK`

#### `POST /tranca/:id/trancar`
Tranca uma bicicleta na tranca especificada.

**Request:**
```json
{
  "idBicicleta": 5
}
```

**Response:** `200 OK`

#### `POST /tranca/:id/destrancar`
Destranca a bicicleta da tranca especificada.

**Response:** `200 OK`

#### `POST /tranca/integrarNaRede`
Integra uma tranca em um totem.

**Request:**
```json
{
  "idTotem": 2,
  "idTranca": 8,
  "idFuncionario": 10
}
```

**Response:** `200 OK`

#### `POST /tranca/retirarDaRede`
Remove uma tranca de um totem para manutenção.

**Request:**
```json
{
  "idTotem": 2,
  "idTranca": 8,
  "idFuncionario": 10,
  "statusAcaoReparador": "EM_REPARO"
}
```

**Response:** `200 OK`

### Totems

#### `POST /totem`
Cria um novo totem.

**Request:**
```json
{
  "localizacao": "Av. Paulista, 1578 - São Paulo, SP",
  "descricao": "Totem principal - Estação MASP"
}
```

#### `GET /totem`
Lista todos os totems.

#### `GET /totem/:id`
Retorna um totem específico.

#### `PUT /totem/:id`
Atualiza os dados de um totem.

#### `DELETE /totem/:id`
Remove um totem do sistema.

**Response:** `200 OK`

#### `GET /totem/:id/trancas`
Lista todas as trancas associadas a um totem.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "numero": 42,
    "localizacao": "Totem Paulista",
    "status": "LIVRE",
    "bicycleId": null
  }
]
```

#### `GET /totem/:id/bicicletas`
Lista todas as bicicletas disponíveis em um totem (através das trancas).

**Response:** `200 OK`
```json
[
  {
    "id": 5,
    "marca": "Caloi",
    "modelo": "Elite",
    "status": "DISPONIVEL"
  }
]
```

## 📁 Estrutura do Projeto

```
equipment-service/
├── src/
│   ├── bicycle/
│   │   ├── dto/
│   │   ├── bicycle.controller.ts
│   │   ├── bicycle.entity.ts
│   │   ├── bicycle.module.ts
│   │   ├── bicycle.service.ts
│   │   └── bicycle-network.service.ts
│   ├── lock/
│   │   ├── dto/
│   │   ├── lock.controller.ts
│   │   ├── lock.entity.ts
│   │   ├── lock.module.ts
│   │   ├── lock.service.ts
│   │   └── lock-network.service.ts
│   ├── totem/
│   │   ├── dto/
│   │   ├── totem.controller.ts
│   │   ├── totem.entity.ts
│   │   ├── totem.module.ts
│   │   └── totem.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── postman/
│   ├── equipment-service.postman_collection.json
│   └── README.md
├── .env.example
├── package.json
└── README.md
```

## 🌐 Deploy (Render)

### Variáveis de Ambiente no Render

```
NODE_ENV=production
EXTERNAL_SERVICE_URL=https://your-external-service.onrender.com
```

> **Nota:** `DATABASE_URL` é fornecida automaticamente pelo Render ao conectar um PostgreSQL.

## 📮 Testando com Postman

Coleções Postman completas estão disponíveis em `postman/`:

1. Importe `equipment-service.postman_collection.json`
2. Configure o ambiente (`local` ou `production`)
3. Execute os requests!

Veja [postman/README.md](postman/README.md) para mais detalhes.

## 🔄 Integração com External Service

O Equipment Service se integra com o External Service para:

- **Envio de Emails**: Notificações sobre status de equipamentos
- **Processamento de Pagamentos**: Cobranças de aluguel através do External Service

### Exemplos de Integração

**Incluir Bicicleta na Rede (UC08):**
1. Equipment Service valida bicicleta e tranca
2. Atualiza status da bicicleta para DISPONIVEL
3. Chama External Service para enviar email ao funcionário

**Retirar Bicicleta para Reparo (UC09):**
1. Equipment Service valida bicicleta e tranca
2. Atualiza status da bicicleta para EM_REPARO
3. Chama External Service para enviar email ao funcionário

## 🔍 Status dos Equipamentos

### Status de Bicicletas
- **AVAILABLE** (DISPONIVEL): Bicicleta disponível para aluguel
- **IN_USE** (EM_USO): Bicicleta em uso
- **NEW** (NOVA): Bicicleta recém-adicionada ao sistema
- **RETIRED** (APOSENTADA): Bicicleta aposentada
- **REPAIR_REQUESTED** (REPARO_SOLICITADO): Reparo solicitado
- **IN_REPAIR** (EM_REPARO): Bicicleta em manutenção

### Status de Trancas
- **LIVRE**: Tranca disponível (sem bicicleta)
- **OCUPADA**: Tranca com bicicleta
- **NOVA**: Tranca recém-instalada
- **APOSENTADA**: Tranca desativada
- **REPARO_SOLICITADO**: Reparo solicitado
- **EM_REPARO**: Tranca em manutenção

## 🐛 Troubleshooting

### Erro de Conexão com o Banco
**Solução:** Verifique se PostgreSQL está rodando e as credenciais estão corretas.

### Erro 404 ao Chamar External Service
**Causa:** `EXTERNAL_SERVICE_URL` não configurada ou serviço externo offline
**Solução:** Configure a variável de ambiente e verifique se o External Service está rodando

### Conflito ao Integrar Bicicleta
**Causa:** Tranca já ocupada ou bicicleta já em uso
**Solução:** Verifique o status da tranca e bicicleta antes de integrar

---

**Versão:** 0.0.1
**Framework:** NestJS 11
**TypeScript:** 5.7
