# schema-publisher-action
This action will publish all subjects from a specific tenant to a specific Ceph folder.

This action expects that the `subjects-path` specified folder is structured in the following way:
```
$SUBJECTS_FOLDER/$A_TENANT/a_subject.json
$SUBJECTS_FOLDER/$ANOTHER_TENANT/a_subject.json
$SUBJECTS_FOLDER/$ANOTHER_TENANT/another_subject.json
$SUBJECTS_FOLDER/$YET_ANOTHER_TENANT/a_subject.json
```

## Inputs

* [`subjects-path`](#subjects-path)
* [`environment`](#environment)
* [`owner`](#owner)
* [`force`](#force)
* [`tenant`](#tenant)
* [`local-access-key`](#local-access-key)
* [`local-secret-key`](#local-secret-key)
* [`des-access-key`](#des-access-key)
* [`des-secret-key`](#des-secret-key)
* [`preint-access-key`](#preint-access-key)
* [`preint-secret-key`](#preint-secret-key)
* [`pre-access-key`](#pre-access-key)
* [`pre-secret-key`](#pre-secret-key)

## Development Team Documentation

## Inputs

### subjects-path
Repository  path where the subject's json schema are stored. The path must be relative to the repository root, so it must not start with `/`.

The default value is `./dataext`.

### environment
Environment id where the schema is deployed.

The expected value is one of the known environment identifiers: `des`, `preint`, `pre`, `protest` and `pro`.

### owner
Repository identfier running the action. 

When an schema is deployed for the first time, the owner information is added as part of the schema metadata. This is used on future schema deployments to check if the repository deploying is still the owner of that schema. When the owner differs from the repository executing the deployment the job fails to prevent mistakes. See [`force`](#force).

The default value is the repository name provided by Github in `${{ env.GITHUB_REPOSITORY }}`. See the official [env variables reference](https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables) for more information.

The ownership over an schema is marked using the Ceph Object Tagging feature. The tag is named `owner`.

### force
Flag that indicates that the subject will be overriden even when this repositority is not the owner.

As explained in [`owner`](#owner), when the owner of a schema differs, the job  automatically fails to prevent mistakes. Changing `force` to `true` will ignore the owner behaviour, allowing to override a schema even when the repository is not the actual owner.

WARNING: Set it to `true` just for special ocassions :)

### tenant
Tenant for which the schemas will be deployed.

The expected value is one of the existing tenants: `bk`, `lf`, `md`, `oy`, `pb`, `st`, `ut`, `za`, `zh`.

### local-access-key
Ceph access key for the local environment. 

This setting is used during the deployment to authenticate on Ceph. This is used along with the [`local-secret-key`](#local-secret-key).

### local-secret-key
Ceph secret key for the local environment. 

This setting is used during the deployment to authenticate on Ceph. This is used along with the [`local-access-key`](#local-access-key).

### des-access-key
Ceph access key for the des environment. 

This setting is used during the deployment to authenticate on Ceph. This is used along with the [`local-secret-key`](#des-secret-key).

### des-secret-key
Ceph secret key for the des environment. 

This setting is used during the deployment to authenticate on Ceph. This is used along with the [`des-access-key`](#des-access-key).

### preint-access-key
Ceph access key for the preint environment. 

This setting is used during the deployment to authenticate on Ceph. This is used along with the [`preint-secret-key`](#preint-secret-key).

### preint-secret-key
Ceph secret key for the preint environment. 

This setting is used during the deployment to authenticate on Ceph. This is used along with the [`preint-access-key`](#preint-access-key).

### pre-access-key
Ceph access key for the pre environment. 

This setting is used during the deployment to authenticate on Ceph. This is used along with the [`pre-secret-key`](#pre-secret-key).

### pre-secret-key
Ceph secret key for the pre environment. 

This setting is used during the deployment to authenticate on Ceph. This is used along with the [`pre-access-key`](#pre-access-key).

## Examples

A simple example to publish the `./dataext` (default value) folder:
```yaml
- name: Publish Subjects
  uses: ./.github/actions/openplatform/packages/schema-publisher-action
```

Deploying the subjects to a specific environment (useful for CD jobs triggered by merges on specific branches):
```yaml
- name: Publish Subjects
  uses: './.github/actions/openplatform/packages/schema-publisher-action'
  with:
    environment: preint
```

Deploying all the subjects found in a differnet folder than the default:
```yaml
- name: Publish Subjects
  uses: './.github/actions/openplatform/packages/schema-publisher-action'
  with:
    subjects-path: ./custom_folder/all_schemas
```