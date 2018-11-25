import { expect } from 'chai';
import { Source } from './../../src/coveoObjects/Source';

export const SourceTest = () => {
  describe('Source Model', () => {
    const postConversionExtensions = [
      {
        actionOnError: 'SKIP_EXTENSION',
        condition: '',
        extensionId: 'foxentertainmentgroupsandbox1-wze2yoe63saarcpqo7gfpnsmvi',
        parameters: {
          extension_name: 'Capture Metadata'
        },
        versionId: ''
      },
      {
        actionOnError: 'SKIP_EXTENSION',
        condition: '%[fmcepisodename]',
        extensionId: 'foxentertainmentgroupsandbox1-xaczpkd2abdiucync2cww5ccgm',
        parameters: {},
        versionId: ''
      }
    ];
    const mappings = [
      {
        id: 'qct6ioc3vrl3l7tw3vj5mxsmza',
        kind: 'COMMON',
        fieldName: 'entopsseriesname',
        extractionMethod: 'METADATA',
        content: '%[fmcseriesname]'
      },
      {
        id: 'qf575jsjk55wjkdiy23xaskmc4',
        kind: 'COMMON',
        fieldName: 'entopsclosedcaptionlanguage',
        extractionMethod: 'METADATA',
        content: '%[fmcclosedcaptionlanguage]'
      },
      {
        id: 'qhmhybdyu6bozoy7hwr3zcsa6e',
        kind: 'COMMON',
        fieldName: 'entopsdivision',
        extractionMethod: 'METADATA',
        content: '%[fmcdivision]'
      }
    ];
    const configuration = {
      id: 'r6ud7iksjhafgjpiokjh-sdfgr3e',
      name: 'testSource',
      sourceType: 'SITEMAP',
      sourceSecurityOption: 'Specified',
      postConversionExtensions: postConversionExtensions,
      preConversionExtensions: [],
      mappings: mappings,
      addressPatterns: [
        {
          expression: '*',
          patternType: 'Wildcard',
          allowed: true
        }
      ],
      permissions: [
        {
          permissionSets: [
            {
              allowedPermissions: [
                {
                  identityType: 'Group',
                  securityProvider: 'Email Security Provider',
                  identity: '*@*'
                }
              ]
            }
          ]
        }
      ]
    };

    const testSource = new Source(configuration);

    it('Should return the source ID', () => {
      expect(testSource.getId()).to.equal('r6ud7iksjhafgjpiokjh-sdfgr3e');
    });

    it('Should return the source name', () => {
      expect(testSource.getName()).to.equal('testSource');
    });

    it('Should return the source type', () => {
      expect(testSource.getSourceType()).to.equal('SITEMAP');
    });

    it('Should return the source mappings', () => {
      expect(testSource.getMappings()).to.eql([
        {
          id: 'qct6ioc3vrl3l7tw3vj5mxsmza',
          kind: 'COMMON',
          fieldName: 'entopsseriesname',
          extractionMethod: 'METADATA',
          content: '%[fmcseriesname]'
        },
        {
          id: 'qf575jsjk55wjkdiy23xaskmc4',
          kind: 'COMMON',
          fieldName: 'entopsclosedcaptionlanguage',
          extractionMethod: 'METADATA',
          content: '%[fmcclosedcaptionlanguage]'
        },
        {
          id: 'qhmhybdyu6bozoy7hwr3zcsa6e',
          kind: 'COMMON',
          fieldName: 'entopsdivision',
          extractionMethod: 'METADATA',
          content: '%[fmcdivision]'
        }
      ]);
    });

    it('Should return the source post conversion extensions', () => {
      expect(testSource.getPostConversionExtensions()).to.eql([
        {
          actionOnError: 'SKIP_EXTENSION',
          condition: '',
          extensionId: 'foxentertainmentgroupsandbox1-wze2yoe63saarcpqo7gfpnsmvi',
          parameters: {
            extension_name: 'Capture Metadata'
          },
          versionId: ''
        },
        {
          actionOnError: 'SKIP_EXTENSION',
          condition: '%[fmcepisodename]',
          extensionId: 'foxentertainmentgroupsandbox1-xaczpkd2abdiucync2cww5ccgm',
          parameters: {},
          versionId: ''
        }
      ]);
    });

    it('Should return the source pre conversion extensions', () => {
      expect(testSource.getPreConversionExtensions()).to.eql([]);
    });

    it('Should return the source configuration', () => {
      expect(testSource.getConfiguration()).to.eql({
        id: 'r6ud7iksjhafgjpiokjh-sdfgr3e',
        name: 'testSource',
        sourceType: 'SITEMAP',
        sourceSecurityOption: 'Specified',
        postConversionExtensions: postConversionExtensions,
        preConversionExtensions: [],
        mappings: mappings,
        addressPatterns: [
          {
            expression: '*',
            patternType: 'Wildcard',
            allowed: true
          }
        ],
        permissions: [
          {
            permissionSets: [
              {
                allowedPermissions: [
                  {
                    identityType: 'Group',
                    securityProvider: 'Email Security Provider',
                    identity: '*@*'
                  }
                ]
              }
            ]
          }
        ]
      });
    });

    it('Should clone the initial source', () => {
      const clone = testSource.clone();
      configuration.sourceSecurityOption = 'another value';
      expect(clone.getConfiguration().sourceSecurityOption).to.equal('Specified');
    });
  });
};
