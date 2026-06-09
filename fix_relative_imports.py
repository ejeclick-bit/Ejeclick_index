import os
import re

shared_components = ['Badge', 'Button', 'Input', 'OptimizedImage', 'ThemeToggle', 'Typography', 'AccordionItem', 'FormField', 'GlassCard', 'ServiceCard', 'SocialLink']

def update_imports(dir_path):
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                new_content = content
                for comp in shared_components:
                    # Match import { Comp } from '../atoms/Comp' or '../../atoms/Comp' or '../molecules/Comp' etc
                    new_content = re.sub(
                        rf"import\s+{{\s*{comp}\s*}}\s+from\s+['\"](?:\.\./)+components/(?:atoms|molecules)/{comp}['\"];?",
                        f"import {{ {comp} }} from '@ejeclick/ui-components';",
                        new_content
                    )
                    new_content = re.sub(
                        rf"import\s+{{\s*{comp}\s*}}\s+from\s+['\"](?:\.\./)+(?:atoms|molecules)/{comp}['\"];?",
                        f"import {{ {comp} }} from '@ejeclick/ui-components';",
                        new_content
                    )
                    new_content = re.sub(
                        rf"import\s+{{\s*{comp}\s*}}\s+from\s+['\"]@/components/(?:atoms|molecules)/{comp}['\"];?",
                        f"import {{ {comp} }} from '@ejeclick/ui-components';",
                        new_content
                    )
                
                if new_content != content:
                    with open(path, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {path}")

update_imports('apps/flow-flow/landing/src')
update_imports('apps/flow-flow/admin/src')
