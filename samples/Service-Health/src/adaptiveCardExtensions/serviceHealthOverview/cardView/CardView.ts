import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ServiceHealthOverviewAdaptiveCardExtensionStrings';
import { IServiceHealthOverviewAdaptiveCardExtensionProps, IServiceHealthOverviewAdaptiveCardExtensionState, ISSUES_VIEW_REGISTRY_ID } from '../ServiceHealthOverviewAdaptiveCardExtension';
import uniqBy from 'lodash/uniqBy';

export class CardView extends BasePrimaryTextCardView<IServiceHealthOverviewAdaptiveCardExtensionProps, IServiceHealthOverviewAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: "View details",
        style: 'positive',
        action: {
          type: 'QuickView',
          parameters: {
            view: ISSUES_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {

    if (this.state.serviceHealthIssues === null) {
      return {
        primaryText: "Loading...",
        description: "",
        title: this.properties.title,
        iconProperty: "Timer"
      };
    }

    let { serviceHealthIssues } = this.state;
    let servicesAffected = serviceHealthIssues.value;

    // const numberOfServicesAffected: number = [...new Set(servicesAffected.map(s => s.service))].length;
    const numberOfServicesAffected: number = uniqBy(servicesAffected, 'service').length;
    const numberOfIssues: number = serviceHealthIssues['@odata.count'];

    return {
      primaryText: `Currently ${numberOfIssues} issue${numberOfIssues > 1 ? 's' : ''}`,
      description: `${numberOfServicesAffected} service${numberOfServicesAffected > 1 ? 's' : ''} affected`,
      title: this.properties.title,
      iconProperty: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M10.9085 2.78216C11.9483 2.20625 13.2463 2.54089 13.8841 3.5224L13.9669 3.66023L21.7259 17.6685C21.9107 18.0021 22.0076 18.3773 22.0076 18.7587C22.0076 19.9495 21.0825 20.9243 19.9117 21.0035L19.7576 21.0087H4.24187C3.86056 21.0087 3.4855 20.9118 3.15192 20.7271C2.11208 20.1513 1.70704 18.8734 2.20059 17.812L2.27349 17.6687L10.0303 3.66046C10.2348 3.2911 10.5391 2.98674 10.9085 2.78216ZM12.0004 16.0018C11.4489 16.0018 11.0018 16.4489 11.0018 17.0004C11.0018 17.552 11.4489 17.9991 12.0004 17.9991C12.552 17.9991 12.9991 17.552 12.9991 17.0004C12.9991 16.4489 12.552 16.0018 12.0004 16.0018ZM11.9983 7.99806C11.4854 7.99825 11.0629 8.38444 11.0053 8.8818L10.9986 8.99842L11.0004 13.9993L11.0072 14.1159C11.0652 14.6132 11.488 14.9991 12.0008 14.9989C12.5136 14.9988 12.9362 14.6126 12.9938 14.1152L13.0004 13.9986L12.9986 8.9977L12.9919 8.88108C12.9339 8.38376 12.5111 7.99788 11.9983 7.99806Z' fill='%23EED202'%3E%3C/path%3E%3C/svg%3E"
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://admin.microsoft.com/#/servicehealth'
      }
    };
  }
}
