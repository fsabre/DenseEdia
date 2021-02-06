# TODO

## HTTP Routes

- [x] GET /edia
- [x] GET /edia/1
- [x] GET /edia/elements
- [ ] GET /edia/links
- [x] POST /edia
- [x] PATCH /edia/1
- [x] DELETE /edia/1

- [x] GET /elements
- [x] GET /elements/1
- [x] POST /elements/none
- [x] POST /elements/bool
- [x] POST /elements/int
- [x] POST /elements/float
- [x] POST /elements/str
- [x] POST /elements/datetime
- [x] PATCH /elements/1
- [x] DELETE /elements/1

- [x] GET /links
- [x] GET /links/1
- [X] POST /links
- [x] PATCH /links/1
- [x] DELETE /links/1

## Bugs

- [ ] When PATCHing an Entity with a DateTime that has a `tzinfo`, the value is stored as a str. It is a Pony issue (#434).

## Comfort of use

- [ ] Write an OpenAPI specification
- [ ] Add a logo and set it as a favicon
- [ ] Check the response code when doing requests

## Code quality

- [ ] Add comments and docstrings

