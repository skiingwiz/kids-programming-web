#!.venv/bin/python

from jinja2 import Environment, FileSystemLoader

env = Environment(
  loader = FileSystemLoader("src/templates"),
)

for t in env.list_templates():
  if t.endswith('.j2'):
    print(t)
    env.get_template(t) \
       .stream() \
       .dump("build/dist/" + t.replace('.j2', ''))

