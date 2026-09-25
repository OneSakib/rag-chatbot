## Build only for backend
```bash
    docker compose up -d --build 
    docker compose up -d --build api 
    docker compose up -d --build api worker
```    
## Restart
```bash
    docker compose restart api
    docker compose restart worker
    docker compose restart api worker
```    