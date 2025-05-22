Frontend -> Metricas sincronização, logs => API -> Injeta uma chamada na fila (Sincroniza as bebidas do superkilo de montes claros)

Orquestrador -> Harvester -> Supermarket Worker
<- Consome da topico encore - processamento -> salva no banco daquele worker (Postgres)

(Click house) Agente IA <- ETL <-- Normalizado
