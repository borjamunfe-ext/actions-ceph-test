# schema-validator-action
This action validates the json schemas found in the specified folder. It validates that the jsons are well formed and its content is compliant with the JSON Schema specification.

You can find more info about the JSON Schema spec in [its official website](https://json-schema.org/specification.html)

## Inputs

* [`subjects-path`](#subjects-path)

## Development Team Documentation

## Inputs

### subjects-path
Repository  path where the subject's json schema are stored. The path must be relative to the repository root, so it must not start with `/`.

The default value is `./dataext`.

## Examples

A simple example to publish the `./dataext` folder:
```yaml
- name: Validate Subjects
  uses: ./.github/actions/openplatform/packages/schema-validator-action
```

Using a different folder for the schemas: 
```yaml
- name: Validate Subjects
  uses: './.github/actions/openplatform/packages/schema-validator-action'
  with:
    subjects-path: ./custom_folder/all_schemas
```

