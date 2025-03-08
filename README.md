1 - Primeiramente precisa ter na máquina o Node.js e o SQL Server e o SSMS para rodar a aplicação de forma correta;

2 - Depois de ter baixado o SQL Server e o Node.js, configure o SQL Server restaurando a base de nome "ImpactaProject" com o arquivo de backup onde tem os dados 
que salvamos e utilizamos na nossa aplicação la, irei disponibilizar esse arquivo junto com os arquivos da aplicação;

3 - Abra o SQL Server Configuration Manager, depois va para a opção "Configuração de Rede do SQL Server" > "Protocols para (Nome da Instância)" e depois clique
com o botão direito no TCP/IP e selecione "Enable".

4 - Feito isso, dentro do SSMS e ja logado no banco da sua máquina clique com o botão direito do mouse em "Bancos de Dados" e clique em seguida em 
"Restaurar Banco de Dados...", depois vá em "dipositivos" e selecione o arquivo (ImpactaProject.bak) disponibilizado no Github, em seguida vá na opção "OPÇÕES" 
e selecione a caixinha "Subistituir o banco de dados existente (WITH REPLACE)" e aperte OK;

5 - Dentro do VS Code na aplicação, rode o comando "node server.js" dentro do terminal do caminho da pasta "backend" para rodar a conexão com o banco de dados;

6 - Depois abra o Live Server do arquivo "index.html" para ver a aplicação sendo rodada corretamente;
