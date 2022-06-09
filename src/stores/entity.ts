import create from 'zustand';
import {persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as API from '@bluecentury/api/vemasys';
import {ENTITY_TYPE_EXPLOITATION_VESSEL} from '@bluecentury/constants';

type EntityState = {
  isLoadingEntityUsers: boolean;
  entityUsers: [];
  entityId: string;
  entityType: string;
  entityRole: string;
  entityUserId: string;
  vesselId: string;
  physicalVesselId: string;
  navigationLog: any;
  cargoEntryId: string;
  reservoirId: string;
  engineId: string;
  taskId: string;
  bunkeringId: string;
  certificateId: string;
  pegelId: string;
  userCertificateId: string;
  pdfUrl: string;
  searchedUser: any;
  engineGauge: any;
  fleetVessel: number;
  navigationLogId: string;
  cargoEntry: any;
  navigationLogActionId: string;
  cargoHoldId: string;
  crewMember: any;
  userCertificate: any;
  imageUrl: string;
  consumableTypeId: string;
};

type EntityActions = {
  getEntityUsers: () => void;
  selectEntityUser: (entity: any) => void;
};

type EntityStore = EntityState & EntityActions;

export const useEntity = create(
  persist<EntityStore>(
    set => ({
      entityUsers: [],
      isLoadingEntityUsers: false,
      entityId: '',
      entityType: '',
      entityRole: '',
      entityUserId: '',
      vesselId: '',
      physicalVesselId: '',
      navigationLog: null,
      cargoEntryId: '',
      reservoirId: '',
      engineId: '',
      taskId: '',
      bunkeringId: '',
      certificateId: '',
      pegelId: '',
      userCertificateId: '',
      pdfUrl: '',
      searchedUser: null,
      engineGauge: null,
      fleetVessel: 0,
      navigationLogId: '',
      cargoEntry: null,
      navigationLogActionId: '',
      cargoHoldId: '',
      crewMember: null,
      userCertificate: null,
      imageUrl: '',
      consumableTypeId: '',
      getEntityUsers: async () => {
        set({
          isLoadingEntityUsers: true,
        });
        try {
          const response = await API.reloadEntityUsers();
          set({
            entityUsers: response,
            isLoadingEntityUsers: false,
          });
        } catch (error) {
          set({
            isLoadingEntityUsers: false,
          });
        }
      },
      selectEntityUser: async (entity: any) => {
        const entityRole = entity.role.title;
        const entityType = entity.entity.type.title;
        const physicalVesselId =
          entity.entity.exploitationVessel &&
          entity.entity.exploitationVessel.physicalVessel
            ? entity.entity.exploitationVessel.physicalVessel.id
            : null;

        set({
          entityId: entity.entity.id,
          entityUserId: entity.id,
          entityRole,
          physicalVesselId,
          entityType,
          vesselId:
            ENTITY_TYPE_EXPLOITATION_VESSEL === entityType
              ? entity.entity.exploitationVessel.id
              : entity.entity.exploitationGroup.exploitationVessels[0].id,
        });
        try {
          API.selectEntityUser(entity.id);
        } catch (error) {}
      },
    }),
    {
      name: 'entity-storage',
      getStorage: () => AsyncStorage,
    },
  ),
);
