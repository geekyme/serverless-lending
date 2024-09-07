# Technical Design Document: Serverless Loan Origination System

## 1. Introduction

This document outlines the technical design for a serverless Loan Origination System (LOS) using AWS services. The system is designed to handle the entire loan application process for Small and Medium Businesses (SMBs), from initial submission to final decision, in a scalable and efficient manner.

## 2. System Architecture

The LOS is built using a serverless architecture, primarily leveraging AWS services:

- AWS Lambda for compute
- Amazon API Gateway for API management
- Amazon DynamoDB for database storage
- Amazon S3 for document storage
- AWS Step Functions for workflow orchestration
- Amazon SNS for notifications
- Amazon Athena and QuickSight for reporting and analytics

## 3. Key Components

### 3.1 Application Submission API

- **Purpose**: Handle loan application submissions
- **Technologies**: API Gateway, Lambda, DynamoDB
- **Key Functions**:
  - Input validation and sanitization
  - Data storage
  - Workflow initiation

### 3.2 Document Upload and Storage

- **Purpose**: Manage applicant documents
- **Technologies**: S3, Lambda
- **Key Functions**:
  - Secure document storage
  - Document validation and processing

### 3.3 Credit Check Service

- **Purpose**: Perform credit checks on applicants
- **Technologies**: Lambda, DynamoDB
- **Key Functions**:
  - Integration with credit bureaus
  - Credit report summary storage
  - Error handling and retries

### 3.4 Loan Underwriting Engine

- **Purpose**: Evaluate loan applications
- **Technologies**: Step Functions, Lambda, (optionally) SageMaker
- **Key Functions**:
  - Orchestrate underwriting process
  - Apply business rules
  - Risk assessment

### 3.5 Notification System

- **Purpose**: Communicate with applicants and internal stakeholders
- **Technologies**: SNS, Lambda
- **Key Functions**:
  - Send notifications via email, SMS, push
  - Manage notification templates

### 3.6 Reporting and Analytics

- **Purpose**: Provide insights and generate reports
- **Technologies**: Athena, QuickSight, S3
- **Key Functions**:
  - Query loan data
  - Generate visualizations
  - Export metrics

## 4. User Stories

| ID  | As a...        | I want to...                                    | So that...                                             |
| --- | -------------- | ----------------------------------------------- | ------------------------------------------------------ |
| US1 | Loan Applicant | Submit a loan application online                | I can apply for a loan conveniently                    |
| US2 | Loan Applicant | Upload required documents                       | I can provide necessary information for my application |
| US3 | Loan Applicant | Receive status updates                          | I can stay informed about my application's progress    |
| US4 | Underwriter    | View a summary of the applicant's credit report | I can assess the applicant's creditworthiness          |
| US5 | Underwriter    | Access all submitted documents                  | I can verify the applicant's information               |
| US6 | Loan Officer   | See a dashboard of all pending applications     | I can manage the workflow efficiently                  |
| US7 | Manager        | Generate reports on loan applications           | I can analyze trends and make informed decisions       |
| US8 | System Admin   | Monitor system performance                      | I can ensure the system is running smoothly            |

## 5. Functional Requirements

| ID  | Requirement            | Description                                                              | Component                   |
| --- | ---------------------- | ------------------------------------------------------------------------ | --------------------------- |
| FR1 | Application Submission | System must allow online submission of loan applications                 | Application Submission API  |
| FR2 | Document Upload        | System must support secure upload and storage of applicant documents     | Document Upload and Storage |
| FR3 | Credit Check           | System must integrate with credit bureaus to perform credit checks       | Credit Check Service        |
| FR4 | Underwriting           | System must apply business rules to evaluate loan applications           | Loan Underwriting Engine    |
| FR5 | Notification           | System must send timely notifications to applicants and internal users   | Notification System         |
| FR6 | Reporting              | System must generate reports on loan applications and system performance | Reporting and Analytics     |

## 6. Non-Functional Requirements

| ID   | Requirement    | Description                                                          |
| ---- | -------------- | -------------------------------------------------------------------- |
| NFR1 | Scalability    | System must handle varying loads, from 10 to 10,000 concurrent users |
| NFR2 | Performance    | API responses must be delivered within 500ms for 95% of requests     |
| NFR3 | Availability   | System must maintain 99.9% uptime                                    |
| NFR4 | Data Retention | Application data must be retained for 7 years                        |

## 7. Data Model

| Entity                  | Attributes                                                                                                                                                                                                | Relationships                                                                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business (Applicant)    | - BusinessID (PK)<br>- LegalName<br>- TradingName<br>- BusinessStructure<br>- TaxID<br>- DateEstablished<br>- NumberOfEmployees<br>- AnnualRevenue<br>- IndustryCode<br>- Address<br>- ContactInformation | - Has many Loan Applications<br>- Has many Business Owners<br>- Belongs to one Industry Classification                                                                             |
| Loan Application        | - ApplicationID (PK)<br>- BusinessID (FK)<br>- LoanProductID (FK)<br>- ApplicationDate<br>- RequestedAmount<br>- LoanPurpose<br>- ApplicationStatus<br>- SubmittedBy                                      | - Belongs to one Business<br>- Has one Loan Product<br>- Has many Financial Documents<br>- Has one Underwriting Decision<br>- Has one Credit Report<br>- Has many Collateral items |
| Business Owner          | - OwnerID (PK)<br>- BusinessID (FK)<br>- FirstName<br>- LastName<br>- DateOfBirth<br>- SSN<br>- OwnershipPercentage<br>- Address<br>- ContactInformation                                                  | - Belongs to one Business                                                                                                                                                          |
| Financial Document      | - DocumentID (PK)<br>- ApplicationID (FK)<br>- DocumentType<br>- UploadDate<br>- FileLocation<br>- VerificationStatus                                                                                     | - Belongs to one Loan Application                                                                                                                                                  |
| Loan Product            | - LoanProductID (PK)<br>- ProductName<br>- InterestRateType<br>- BaseInterestRate<br>- LoanTerm<br>- MinimumAmount<br>- MaximumAmount<br>- CollateralRequired                                             | - Has many Loan Applications                                                                                                                                                       |
| Underwriting Decision   | - DecisionID (PK)<br>- ApplicationID (FK)<br>- DecisionDate<br>- DecisionStatus<br>- ApprovedAmount<br>- AssignedInterestRate<br>- DecisionRationale<br>- UnderwriterID                                   | - Belongs to one Loan Application                                                                                                                                                  |
| Credit Report           | - ReportID (PK)<br>- ApplicationID (FK)<br>- BusinessID (FK)<br>- CreditScore<br>- ReportDate<br>- CreditBureau<br>- ReportSummary                                                                        | - Belongs to one Loan Application<br>- Belongs to one Business                                                                                                                     |
| Collateral              | - CollateralID (PK)<br>- ApplicationID (FK)<br>- CollateralType<br>- EstimatedValue<br>- Description<br>- AppraisalDate                                                                                   | - Belongs to one Loan Application                                                                                                                                                  |
| Industry Classification | - IndustryCode (PK)<br>- IndustryName<br>- RiskCategory                                                                                                                                                   | - Has many Businesses                                                                                                                                                              |

### Data Integrity Considerations

1. Use foreign keys to maintain referential integrity
2. Implement check constraints for numerical fields
3. Use enumerated types for status fields
4. Implement proper indexing on frequently queried fields
5. Use UUID or auto-incrementing values for primary keys
6. Implement soft delete functionality

### Common Data Access Patterns

1. Retrieve all loan applications for a specific business
2. Fetch all documents related to a loan application
3. Get the latest underwriting decision for a loan application
4. Retrieve all owners of a business
5. Fetch all loan applications within a specific date range or status

## 9. Deployment Strategy

- Use the Serverless Framework for defining and deploying AWS resources
- Key aspects of the Serverless Framework implementation:
  - Define services in `serverless.yml` files
  - Utilize plugins for extended functionality (e.g., serverless-offline for local testing)
  - Implement environment-specific configurations
  - Use custom resources for any AWS resources not natively supported by the framework
- Implement CI/CD pipeline using AWS CodePipeline or a third-party tool like GitLab CI or GitHub Actions
- Create separate environments for development, staging, and production
- Use Serverless Framework's built-in support for staging to manage different environments

## 11. Local Development

- Use the Serverless Offline plugin to emulate AWS Lambda and API Gateway locally
- Utilize LocalStack for emulating other AWS services not covered by Serverless Offline
- Provide Docker Compose setup for local deployment of supporting services (e.g., DynamoDB local)
- Include sample data and test scenarios in the repository
- Implement environment variables for configurable settings

## 12. Future Considerations

- Implement feature flags for gradual rollout of new features
- Consider using AWS AppConfig for dynamic configuration management
- Plan for disaster recovery and multi-region deployment
- Explore Serverless Framework Pro features for enhanced monitoring and deployment management
