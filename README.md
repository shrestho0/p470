

## Initialize and run the project

### Installations

1. MySQL or MariaDB

1. NodeJs


### Setups

1. Create a database. (currently we are using mysql as everyone is familiar)
Go to your mysql cli 

```
CREATE DATABASE DB_NAME;
```

1. Create a file named  `.env` and copy 

1. Copy contents from `.env.example` file and paste to `.env` file

1. Change the `DB_USER`, `DB_PASS` and `DB_NAME` with your DB credentials


### Run the project

Migrate DB 

```
npx prisma migrate dev --name init_or_any_name
```

Populate Dummy Data
```
node prisma/seed.js
```

Run the project
```
npm run dev # watch mode
```

## Project Structure
```
├── README.md
├── prisma
│   ├── dummyData.js    # dummy data populated from here
│   ├── schema.prisma   # models file
│   └── seed.js
└── src
    ├── controllers     # controllers directory
    ├── db.ts
    ├── index.ts        # main file
    ├── routers         # routers directory
    ├── services        # services directory
    └── views           # views directory
```