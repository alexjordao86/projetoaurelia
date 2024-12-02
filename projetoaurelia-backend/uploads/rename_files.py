import os
import unicodedata

def sanitize_filename(filename):
    # Normaliza e remove apenas caracteres que não são permitidos
    sanitized = unicodedata.normalize('NFD', filename).encode('ascii', 'ignore').decode('utf-8')
    # Substitui espaços e caracteres inválidos por underscores
    sanitized = ''.join(char if char.isalnum() or char in '._-' else '_' for char in sanitized)
    # Remove underscores consecutivos
    sanitized = '_'.join(filter(None, sanitized.split('_')))
    return sanitized

# Diretório atual
directory = '.'

# Renomeia os arquivos no diretório
for filename in os.listdir(directory):
    if filename != "rename_files.py":  # Ignora o script atual
        new_name = sanitize_filename(filename)
        if filename != new_name:
            print(f'Renomeando: {filename} -> {new_name}')
            try:
                os.rename(os.path.join(directory, filename), os.path.join(directory, new_name))
            except Exception as e:
                print(f'Erro ao renomear {filename}: {e}')

