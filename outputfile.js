yyyy
 const [createApplicationCall, createApplicationCallResponse] = useCreateApplicationMutation();
import { useCreateApplicationMutation } from 'onevzsoemfecommon/AccountAPIService';
 useCreateApplicationMutation.mockReturnValue([
        jest.fn(),
        {
          status: 'fulfilled',
          data: {
            data: {
              caseId: 'CCD-13031324-C01',
              customerInfo: {
                applicationStatus: 'Application-Initiated',
                mtn: '4232626151',
                accountNumber: '0413704717-00001',
                applicationId: 'U5U5UDT2TQUNTQM4M',
              },
            },
          },
        },
      ]);
