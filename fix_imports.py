import os
import re

def update_imports(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                new_content = re.sub(r"from '@\/components\/(atoms|molecules)\/[^']+'", "from '@ejeclick/ui-components'", content)
                
                if new_content != content:
                    with open(path, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {path}")

update_imports('apps/landing-ejeclick/src')
update_imports('apps/flow-flow/landing/src')
update_imports('apps/flow-flow/admin/src')
