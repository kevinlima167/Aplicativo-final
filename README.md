# Aplicativo-final
CREATE TABLE usuario (
	usuario_ID SERIAL PRIMARY KEY,
	user_name VARCHAR (255) NOT NULL, 
	password VARCHAR NOT NULL 
)

CREATE TABLE artigo (
	artigo_ID SERIAL PRIMARY KEY,
	titulo_name TEXT NOT NULL, 
	conteudo TEXT NOT NULL,
	data_criacao date NOT NULL,
	usuario_ID INT NOT NULL,
	CONSTRAINT fk_usuario FOREIGN KEY (usuario_ID) REFERENCES usuario(usuario_ID)
	
)
	

CREATE TABLE coment (
	ID SERIAL PRIMARY KEY,
	conteudo TEXT NOT NULL,
	data_criacao date NOT NULL,
	usuario_ID INT NOT NULL,
	artigo_ID INT NOT NULL,
	CONSTRAINT fk_usuario FOREIGN KEY (usuario_ID) REFERENCES usuario(usuario_ID),
	CONSTRAINT fk_artigo FOREIGN KEY (artigo_ID) REFERENCES artigo(artigo_ID)
	
)
