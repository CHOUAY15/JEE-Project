package ma.projet.grpc.serviceexamen.service.impl;

import ma.projet.grpc.serviceexamen.entity.Option;
import ma.projet.grpc.serviceexamen.repository.OptionRepository;
import ma.projet.grpc.serviceexamen.service.OptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OptionServiceImpl implements OptionService {

    @Autowired
    private OptionRepository optionRepository;

    @Override
    public Option createOption(Option option) {
        return optionRepository.save(option);
    }

    @Override
    public Option updateOption(Long id, Option option) {
        Optional<Option> existingOption = optionRepository.findById(id);
        if (existingOption.isPresent()) {
            Option updatedOption = existingOption.get();
            updatedOption.setNomOption(option.getNomOption());
            updatedOption.setNombreEtudiant(option.getNombreEtudiant());
            updatedOption.setNiveauAnnee(option.getNiveauAnnee());
            updatedOption.setModules(option.getModules());
            return optionRepository.save(updatedOption);
        }
        return null; // or throw an exception
    }

    @Override
    public Option getOptionById(Long id) {
        return optionRepository.findById(id).orElse(null);
    }

    @Override
    public List<Option> getAllOptions() {
        return optionRepository.findAll();
    }

    @Override
    public void deleteOption(Long id) {
        optionRepository.deleteById(id);
    }
    public List<Option> saveAllOptions(List<Option> options) {
        return optionRepository.saveAll(options);
    }
}
